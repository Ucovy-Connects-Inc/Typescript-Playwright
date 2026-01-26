import { Page, expect } from '@playwright/test';

export class EmailVerification {
  
  /**
   * Method 1: Direct Outlook Web Access (OWA)
   * Logs into Outlook web and verifies email links
   */
  static async verifyEmailLinkInOutlookWeb(
    page: Page, 
    email: string, 
    password: string, 
    expectedLinkText: string,
    expectedLinkUrl?: string
  ) {
    try {
      // Navigate to Outlook web
      await page.goto('https://outlook.live.com');
      
      // Login process
      await page.fill('input[type="email"]', email);
      await page.click('input[type="submit"]');
      
      // Wait for password field and enter password
      await page.waitForSelector('input[type="password"]', { timeout: 10000 });
      await page.fill('input[type="password"]', password);
      await page.click('input[type="submit"]');
      
      // Handle "Stay signed in?" prompt
      await page.waitForTimeout(2000);
      const staySignedIn = page.locator('text="Stay signed in?"');
      if (await staySignedIn.isVisible()) {
        await page.click('text="No"');
      }
      
      // Wait for inbox to load
      await page.waitForSelector('[role="main"]', { timeout: 30000 });
      
      // Look for the most recent email (adjust selector based on your needs)
      const firstEmail = page.locator('[role="listitem"]').first();
      await firstEmail.click();
      
      // Wait for email content to load
      await page.waitForSelector('[role="document"]', { timeout: 15000 });
      
      // Find and verify the link
      const emailContent = page.locator('[role="document"]');
      const link = emailContent.locator(`a:has-text("${expectedLinkText}")`);
      
      // Verify link exists
      await expect(link).toBeVisible();
      console.log(`✅ Link with text "${expectedLinkText}" found in email`);
      
      // Verify link URL if provided
      if (expectedLinkUrl) {
        const href = await link.getAttribute('href');
        expect(href).toContain(expectedLinkUrl);
        console.log(`✅ Link URL verified: ${href}`);
      }
      
      // Get the actual link for further testing
      const linkHref = await link.getAttribute('href');
      return linkHref;
      
    } catch (error) {
      console.error('❌ Error verifying email link:', error);
      throw error;
    }
  }

  /**
   * Method 2: Email API Integration (Gmail API, Outlook Graph API)
   * More reliable for automation - requires API setup
   */
  static async verifyEmailLinkViaAPI(
    accessToken: string,
    expectedLinkPattern: string
  ) {
    try {
      // Using Microsoft Graph API for Outlook
      const response = await fetch('https://graph.microsoft.com/v1.0/me/messages?$top=1&$select=body', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      const emailBody = data.value[0]?.body?.content;
      
      if (!emailBody) {
        throw new Error('No email found or email body is empty');
      }
      
      // Extract links using regex
      const linkRegex = /<a[^>]*href=["']([^"']*?)["'][^>]*>([^<]*?)<\/a>/gi;
      const links = [];
      let match;
      
      while ((match = linkRegex.exec(emailBody)) !== null) {
        links.push({
          url: match[1],
          text: match[2]
        });
      }
      
      // Find matching link
      const matchingLink = links.find(link => 
        link.url.includes(expectedLinkPattern) || 
        link.text.includes(expectedLinkPattern)
      );
      
      if (matchingLink) {
        console.log(`✅ Link found via API: ${matchingLink.url}`);
        return matchingLink.url;
      } else {
        throw new Error(`❌ Link containing "${expectedLinkPattern}" not found`);
      }
      
    } catch (error) {
      console.error('❌ Error verifying email via API:', error);
      throw error;
    }
  }

  /**
   * Method 3: Email Content File Verification
   * For cases where email content is saved to file
   */
  static async verifyEmailLinkFromFile(
    filePath: string,
    expectedLinkText: string,
    expectedLinkUrl?: string
  ) {
    try {
      const fs = require('fs');
      const emailContent = fs.readFileSync(filePath, 'utf8');
      
      // Parse HTML content for links
      const linkRegex = /<a[^>]*href=["']([^"']*?)["'][^>]*>(.*?)<\/a>/gi;
      const links = [];
      let match;
      
      while ((match = linkRegex.exec(emailContent)) !== null) {
        links.push({
          url: match[1],
          text: match[2].replace(/<[^>]*>/g, '').trim() // Remove HTML tags
        });
      }
      
      // Find matching link
      const matchingLink = links.find(link => 
        link.text.includes(expectedLinkText)
      );
      
      if (!matchingLink) {
        throw new Error(`❌ Link with text "${expectedLinkText}" not found in email file`);
      }
      
      console.log(`✅ Link found: ${matchingLink.url}`);
      
      // Verify URL if provided
      if (expectedLinkUrl && !matchingLink.url.includes(expectedLinkUrl)) {
        throw new Error(`❌ Link URL doesn't match. Expected: ${expectedLinkUrl}, Found: ${matchingLink.url}`);
      }
      
      return matchingLink.url;
      
    } catch (error) {
      console.error('❌ Error verifying email from file:', error);
      throw error;
    }
  }

  /**
   * Method 4: Test the extracted link
   * Verify the link actually works
   */
  static async testEmailLink(
    page: Page,
    linkUrl: string,
    expectedPageTitle?: string,
    expectedContent?: string
  ) {
    try {
      console.log(`🔗 Testing link: ${linkUrl}`);
      
      // Navigate to the link
      await page.goto(linkUrl, { waitUntil: 'networkidle' });
      
      // Verify page loaded successfully
      const title = await page.title();
      console.log(`📄 Page title: ${title}`);
      
      if (expectedPageTitle && !title.includes(expectedPageTitle)) {
        throw new Error(`❌ Page title doesn't match. Expected: ${expectedPageTitle}, Got: ${title}`);
      }
      
      // Verify page content if provided
      if (expectedContent) {
        await expect(page.locator(`text="${expectedContent}"`)).toBeVisible();
        console.log(`✅ Expected content found: ${expectedContent}`);
      }
      
      console.log(`✅ Link verification successful`);
      return true;
      
    } catch (error) {
      console.error('❌ Error testing email link:', error);
      throw error;
    }
  }

  /**
   * Method 5: Handle email verification links (activation, password reset, etc.)
   */
  static async extractVerificationLink(emailContent: string): Promise<string | null> {
    // Common patterns for verification links
    const patterns = [
      /https?:\/\/[^\s]+verify[^\s]*/gi,
      /https?:\/\/[^\s]+activate[^\s]*/gi,
      /https?:\/\/[^\s]+confirm[^\s]*/gi,
      /https?:\/\/[^\s]+reset[^\s]*/gi,
      /https?:\/\/[^\s]+token[^\s]*/gi
    ];
    
    for (const pattern of patterns) {
      const match = emailContent.match(pattern);
      if (match) {
        return match[0].replace(/[">)\]}]+$/, ''); // Clean trailing characters
      }
    }
    
    return null;
  }
}