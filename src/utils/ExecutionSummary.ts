export type ExecutionRecord = {
  title: string;
  fullTitle: string;
  projectName: string;
  status: string;
  expectedStatus: string;
  durationMs: number;
  retry: number;
  file: string;
  line: number;
  tags: string[];
  errorMessage?: string;
};

export type ExecutionSummary = {
  run: {
    startedAt: string;
    finishedAt: string;
    durationMs: number;
    environment: string;
    baseURL: string;
    ci: boolean;
  };
  totals: {
    total: number;
    passed: number;
    failed: number;
    flaky: number;
    skipped: number;
    timedOut: number;
    interrupted: number;
    passRate: number;
  };
  projects: Array<{
    name: string;
    total: number;
    passed: number;
    failed: number;
    flaky: number;
  }>;
  topTags: Array<{
    tag: string;
    count: number;
  }>;
  slowestTests: Array<{
    fullTitle: string;
    projectName: string;
    durationMs: number;
  }>;
  failures: Array<{
    fullTitle: string;
    projectName: string;
    file: string;
    line: number;
    status: string;
    errorMessage: string;
  }>;
  flakyTests: Array<{
    fullTitle: string;
    projectName: string;
    retry: number;
  }>;
};

type RunContext = ExecutionSummary['run'];

function roundPercentage(value: number): number {
  return Math.round(value * 100) / 100;
}

function isFlaky(record: ExecutionRecord): boolean {
  return record.status === 'passed' && record.retry > 0;
}

export function buildExecutionSummary(
  records: ExecutionRecord[],
  run: RunContext,
): ExecutionSummary {
  const totals = {
    total: records.length,
    passed: records.filter((record) => record.status === 'passed').length,
    failed: records.filter((record) => record.status === 'failed').length,
    flaky: records.filter(isFlaky).length,
    skipped: records.filter((record) => record.status === 'skipped').length,
    timedOut: records.filter((record) => record.status === 'timedOut').length,
    interrupted: records.filter((record) => record.status === 'interrupted').length,
    passRate: 0,
  };

  totals.passRate = totals.total === 0 ? 0 : roundPercentage((totals.passed / totals.total) * 100);

  const projectMap = new Map<string, { name: string; total: number; passed: number; failed: number; flaky: number }>();
  const tagMap = new Map<string, number>();

  for (const record of records) {
    const project = projectMap.get(record.projectName) ?? {
      name: record.projectName,
      total: 0,
      passed: 0,
      failed: 0,
      flaky: 0,
    };

    project.total += 1;
    if (record.status === 'passed') {
      project.passed += 1;
    }
    if (record.status === 'failed') {
      project.failed += 1;
    }
    if (isFlaky(record)) {
      project.flaky += 1;
    }

    projectMap.set(record.projectName, project);

    for (const tag of record.tags) {
      tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
    }
  }

  const slowestTests = [...records]
    .sort((left, right) => right.durationMs - left.durationMs)
    .slice(0, 5)
    .map((record) => ({
      fullTitle: record.fullTitle,
      projectName: record.projectName,
      durationMs: record.durationMs,
    }));

  const failures = records
    .filter((record) => record.status !== 'passed' && record.status !== 'skipped')
    .map((record) => ({
      fullTitle: record.fullTitle,
      projectName: record.projectName,
      file: record.file,
      line: record.line,
      status: record.status,
      errorMessage: record.errorMessage ?? 'No error message captured.',
    }));

  const flakyTests = records
    .filter(isFlaky)
    .map((record) => ({
      fullTitle: record.fullTitle,
      projectName: record.projectName,
      retry: record.retry,
    }));

  const topTags = [...tagMap.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }));

  return {
    run,
    totals,
    projects: [...projectMap.values()].sort((left, right) => left.name.localeCompare(right.name)),
    topTags,
    slowestTests,
    failures,
    flakyTests,
  };
}

export function formatExecutionSummaryMarkdown(summary: ExecutionSummary): string {
  const lines: string[] = [];

  lines.push('# Execution Summary');
  lines.push('');
  lines.push(`- Environment: **${summary.run.environment}**`);
  lines.push(`- Base URL: \`${summary.run.baseURL}\``);
  lines.push(`- Started: ${summary.run.startedAt}`);
  lines.push(`- Finished: ${summary.run.finishedAt}`);
  lines.push(`- Duration: ${summary.run.durationMs} ms`);
  lines.push('');
  lines.push('## Totals');
  lines.push('');
  lines.push(`- Total: **${summary.totals.total}**`);
  lines.push(`- Passed: **${summary.totals.passed}**`);
  lines.push(`- Failed: **${summary.totals.failed}**`);
  lines.push(`- Flaky: **${summary.totals.flaky}**`);
  lines.push(`- Skipped: **${summary.totals.skipped}**`);
  lines.push(`- Pass rate: **${summary.totals.passRate}%**`);
  lines.push('');

  if (summary.projects.length > 0) {
    lines.push('## By Project');
    lines.push('');
    for (const project of summary.projects) {
      lines.push(
        `- ${project.name}: total ${project.total}, passed ${project.passed}, failed ${project.failed}, flaky ${project.flaky}`,
      );
    }
    lines.push('');
  }

  if (summary.topTags.length > 0) {
    lines.push('## Top Tags');
    lines.push('');
    for (const tag of summary.topTags) {
      lines.push(`- ${tag.tag}: ${tag.count}`);
    }
    lines.push('');
  }

  if (summary.slowestTests.length > 0) {
    lines.push('## Slowest Tests');
    lines.push('');
    for (const test of summary.slowestTests) {
      lines.push(`- ${test.fullTitle} (${test.projectName}) - ${test.durationMs} ms`);
    }
    lines.push('');
  }

  if (summary.failures.length > 0) {
    lines.push('## Failures');
    lines.push('');
    for (const failure of summary.failures) {
      lines.push(
        `- ${failure.fullTitle} (${failure.projectName}) - ${failure.status} at ${failure.file}:${failure.line}`,
      );
      lines.push(`  - ${failure.errorMessage}`);
    }
    lines.push('');
  }

  if (summary.flakyTests.length > 0) {
    lines.push('## Flaky Tests');
    lines.push('');
    for (const flaky of summary.flakyTests) {
      lines.push(`- ${flaky.fullTitle} (${flaky.projectName}) - retry ${flaky.retry}`);
    }
    lines.push('');
  }

  return lines.join('\n').trimEnd() + '\n';
}
