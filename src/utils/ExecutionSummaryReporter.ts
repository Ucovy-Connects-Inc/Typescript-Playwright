import fs from 'fs';
import path from 'path';
import type { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';
import { buildExecutionSummary, formatExecutionSummaryMarkdown, type ExecutionRecord } from './ExecutionSummary';

type ReporterOptions = {
  jsonOutputFile?: string;
  markdownOutputFile?: string;
};

function extractTags(test: TestCase): string[] {
  const matches = test.title.match(/@\S+/g) ?? [];
  return [...new Set(matches)];
}

export default class ExecutionSummaryReporter implements Reporter {
  private readonly records: ExecutionRecord[] = [];
  private readonly options: ReporterOptions;
  private startedAt = new Date().toISOString();
  private environment = process.env.TEST_ENV ?? 'qa';
  private baseURL = process.env.BASE_URL ?? '';
  private ci = process.env.CI === 'true';

  constructor(options: ReporterOptions = {}) {
    this.options = options;
  }

  onBegin(config: FullConfig, _suite: Suite): void {
    this.startedAt = new Date().toISOString();
    this.baseURL = String(config.projects[0]?.use?.baseURL ?? process.env.BASE_URL ?? '');
    this.environment = process.env.TEST_ENV ?? 'qa';
    this.ci = process.env.CI === 'true';
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const fullTitle = test.titlePath().join(' > ');

    this.records.push({
      title: test.title,
      fullTitle,
      projectName: test.parent.project()?.name ?? 'default',
      status: result.status,
      expectedStatus: test.expectedStatus,
      durationMs: result.duration,
      retry: result.retry,
      file: test.location.file,
      line: test.location.line,
      tags: extractTags(test),
      errorMessage: result.error?.message,
    });
  }

  async onEnd(result: FullResult): Promise<void> {
    const finishedAt = new Date().toISOString();
    const summary = buildExecutionSummary(this.records, {
      startedAt: this.startedAt,
      finishedAt,
      durationMs: result.duration,
      environment: this.environment,
      baseURL: this.baseURL,
      ci: this.ci,
    });

    const jsonOutputFile = this.options.jsonOutputFile ?? 'test-results/execution-summary.json';
    const markdownOutputFile = this.options.markdownOutputFile ?? 'test-results/execution-summary.md';

    await this.writeFile(jsonOutputFile, `${JSON.stringify(summary, null, 2)}\n`);
    await this.writeFile(markdownOutputFile, formatExecutionSummaryMarkdown(summary));
  }

  private async writeFile(filePath: string, content: string): Promise<void> {
    const resolvedPath = path.resolve(process.cwd(), filePath);
    await fs.promises.mkdir(path.dirname(resolvedPath), { recursive: true });
    await fs.promises.writeFile(resolvedPath, content, 'utf-8');
  }
}
