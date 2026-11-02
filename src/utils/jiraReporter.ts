import type { TestCase, TestResult, Reporter } from '@playwright/test/reporter';
import axios from 'axios';
import https from 'https';
import fs from 'fs';
import FormData from 'form-data';
import dotenv from 'dotenv';
dotenv.config();

// (Optional) If you want to capture info logs, keep this, but after imports:
const infoMessages: string[] = [];
const originalConsoleInfo = console.info;
console.info = function (...args: any[]) {
  infoMessages.push(args.join(' '));
  originalConsoleInfo.apply(console, args);
};

const JIRA_BASE_URL = process.env.JIRA_BASE_URL || '';
const JIRA_ProjectKey = process.env.JIRA_PROJECT_KEY || '';
const JIRA_IssueType = process.env.JIRA_ISSUE_TYPE || 'Bug';
const JIRA_USER = process.env.JIRA_USER || '';
const JIRA_TOKEN = process.env.JIRA_TOKEN || '';
const JIRA_AUTH = Buffer.from(`${JIRA_USER}:${JIRA_TOKEN}`).toString('base64');
const agent = new https.Agent({
  rejectUnauthorized: false,
});
interface JiraIssueSearchResult {
  url: string;
  status: string;
}

async function findJiraIssueBySummary(summary: string): Promise<JiraIssueSearchResult | null> {
  try {
    const findTicket = {
      jql: `summary~"${summary}"`,
      fields: ["key", "status"],
      maxResults: 1
    };
    const response = await axios.post(
      `${JIRA_BASE_URL}/rest/api/3/search/jql`,
      findTicket,
      {
        headers: {
          Authorization: `Basic ${JIRA_AUTH}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        httpsAgent: agent,
      }
    );
    // Log the full response body for debugging
    console.log('Jira search response body:', JSON.stringify(response.data, null, 2));
    const issues = response.data.issues;
    if (issues && issues.length > 0) {
      const issue = issues[0];
      const url = `${JIRA_BASE_URL}/browse/${issue.key}`;
      const status = issue.fields && issue.fields.status && issue.fields.status.name ? issue.fields.status.name : '';
      return { url, status };
    }
    return null;
  } catch (error) {
    console.error('Error finding Jira issue:', error);
    return null;
  }
}

async function createJiraIssue(
  summary: string,
  description: string,
  teamName: string
): Promise<string | null> {
  try {
    const jiraBody = {
      fields: {
        project: { id: '10000' },
        issuetype: { id: '10001' },
        summary: `[${teamName}] ${summary}`,
        description: {
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: description }],
            },
          ],
        },
        assignee: { id: '712020:b26afb57-e210-4ff3-9248-e1cf3555c486' },
        labels: [],
        parent: { id: '10003' },
        customfield_10001: 'a94ed843-0d86-46e9-bd08-6838336b32b5',
        customfield_10020: 432,
        customfield_10016: 0,
        fixVersions: [],
        customfield_10021: [],
      },
    };

    const response = await axios.post(
      `${JIRA_BASE_URL}/rest/api/3/issue`,
      jiraBody,
      {
        headers: {
          Authorization: `Basic ${JIRA_AUTH}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        httpsAgent: agent,
      }
    );
    console.info('Jira issue created:', response.data.key);
    await new Promise((resolve) => setTimeout(resolve, 20000)); // Wait for 20 seconds
    return response.data.key
      ? response.data.key // Return the issue key, not the URL
      : null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Error creating Jira issue:',
        error.response?.data || error.message
      );
      if (error.response) {
        console.error('Response data:', error.response);
      }
    } else {
      console.error('Error creating Jira issue:', error);
    }
    return null;
  }
}

// Uploads an attachment (e.g., screenshot) to a Jira issue
async function uploadJiraAttachment(issueKey: string, filePath: string): Promise<string | null> {
  try {
    const url = `${JIRA_BASE_URL}/rest/api/3/issue/${issueKey}/attachments`;
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    const response = await axios.post(url, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Basic ${JIRA_AUTH}`,
        'X-Atlassian-Token': 'no-check',
      },
      httpsAgent: agent,
    });
    return response.data && response.data[0] && response.data[0].id ? response.data[0].id : null;
  } catch (error) {
    console.error('Error uploading Jira attachment:', error);
    return null;
  }
}

class JiraReporter implements Reporter {
  async onTestEnd(test: TestCase, result: TestResult) {
    console.info(`Jira Reporter Enabled: ${process.env.ENABLE_JIRA}`);
    const status=process.env.ENABLE_JIRA;
    
    const totalRetries = test.parent?.project()?.retries ?? 0;
    // Only create a Jira ticket if this is the final failed attempt (after all retries)
    if (result.status === 'failed' && result.retry === totalRetries) {
      if(status=='true') {
      const summary = `Test Failed: ${test.title}`;
      const consoleInfoMessages = result.stdout
        ? result.stdout.filter((chunk: any) => typeof chunk === 'string').join('')
        : '';
      const description = `**Test Title:** ${test.title}\n\n**Error Message:** ${
        result.error?.message || 'No error message'
      }\n\n**Console Info Logs:**\n${
        consoleInfoMessages || 'No console info logs captured.'
      }`;
      const existingIssue = await findJiraIssueBySummary(summary);
      if (existingIssue) {
        console.info(`Jira issue already exists: ${existingIssue.url} (status: ${existingIssue.status})`);
        if (existingIssue.status.toLowerCase() !== 'done') {
          // If status is not Done, do not create a new ticket
          return;
        } else {
          console.info('Existing issue is Done, will create a new ticket.');
        }
      }
      // Get team name from annotation
      const teamAnnotation = test.annotations.find((a) => a.type === 'team');
      const teamName = teamAnnotation?.description || 'Default Team';

      // Create the Jira issue and get the issue key
      const issueKey = await createJiraIssue(summary, description, teamName);
      if (issueKey) {
        console.info(`Jira issue created successfully: ${JIRA_BASE_URL}/browse/${issueKey}`);
        // Try to find a screenshot in attachments (Playwright stores them in result.attachments)
        const attachmentsToUpload = result.attachments?.filter(
          (a: any) =>
            a.name &&
            (
              a.name.toLowerCase().includes('screenshot') ||
              a.name.toLowerCase().includes('trace') ||
              a.name.toLowerCase().includes('video') ||
              (a.path && (
                a.path.toLowerCase().endsWith('.zip') ||
                a.path.toLowerCase().endsWith('.webm') ||
                a.path.toLowerCase().endsWith('.mp4')
              ))
            ) &&
            a.path
        ) || [];

        if (attachmentsToUpload.length > 0) {
          for (const att of attachmentsToUpload) {
            if (att.path) {
              const attachmentId = await uploadJiraAttachment(issueKey, att.path);
              if (attachmentId) {
                console.info(`${att.name} uploaded to Jira issue: ${attachmentId}`);
              } else {
                console.error(`Failed to upload ${att.name} to Jira issue.`);
              }
            }
          }
        } else {
          console.info('No screenshot or trace found to upload to Jira.');
        }
      } else {
        console.error('Failed to create Jira issue.');
      }
    }
    else{
      console.info('Jira Reporter is disabled.');
    }
    }
  
  }
}

export default JiraReporter;