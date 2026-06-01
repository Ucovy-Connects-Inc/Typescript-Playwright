import dotenv from 'dotenv';

dotenv.config();

export type TestEnvironmentName = 'local' | 'dev' | 'qa' | 'prod';

type UserCredentials = {
  email: string;
  password: string;
};

type EnvironmentConfig = {
  name: TestEnvironmentName;
  baseURL: string;
  defaultUser: UserCredentials;
  invalidUser: UserCredentials;
};

function normalizeEnvironment(value: string | undefined): TestEnvironmentName {
  const normalized = value?.toLowerCase();
  if (normalized === 'local' || normalized === 'dev' || normalized === 'prod') {
    return normalized;
  }
  return 'qa';
}

const defaultBaseUrl = process.env.BASE_URL || 'https://ecommerce-playground.lambdatest.io';
const defaultUser = {
  email: process.env.DEFAULT_USER_EMAIL || 'registered.user@example.com',
  password: process.env.DEFAULT_USER_PASSWORD || 'SecurePass123!',
};
const invalidUser = {
  email: process.env.INVALID_USER_EMAIL || 'invalid@email.com',
  password: process.env.INVALID_USER_PASSWORD || 'wrongpassword',
};

const environments: Record<TestEnvironmentName, EnvironmentConfig> = {
  local: {
    name: 'local',
    baseURL: process.env.LOCAL_BASE_URL || defaultBaseUrl,
    defaultUser,
    invalidUser,
  },
  dev: {
    name: 'dev',
    baseURL: process.env.DEV_BASE_URL || defaultBaseUrl,
    defaultUser,
    invalidUser,
  },
  qa: {
    name: 'qa',
    baseURL: process.env.QA_BASE_URL || defaultBaseUrl,
    defaultUser,
    invalidUser,
  },
  prod: {
    name: 'prod',
    baseURL: process.env.PROD_BASE_URL || defaultBaseUrl,
    defaultUser,
    invalidUser,
  },
};

export class Config {
  static readonly TIMEOUT = {
    SHORT: 5000,
    ELEMENT: 10000,
    MEDIUM: 15000,
    LONG: 30000,
  };

  static readonly PERFORMANCE_THRESHOLDS = {
    PAGE_LOAD_TIME: 3000,
    FCP: 1800,
    LCP: 2500,
    FID: 100,
    CLS: 0.1,
  };

  static get environmentName(): TestEnvironmentName {
    return normalizeEnvironment(process.env.TEST_ENV);
  }

  static get environment(): EnvironmentConfig {
    return environments[this.environmentName];
  }

  static get baseURL(): string {
    return this.environment.baseURL;
  }

  static get defaultUser(): UserCredentials {
    return this.environment.defaultUser;
  }

  static get invalidUser(): UserCredentials {
    return this.environment.invalidUser;
  }

  static get enableExecutionSummary(): boolean {
    return (process.env.ENABLE_EXECUTION_SUMMARY ?? 'true').toLowerCase() === 'true';
  }

  static get executionSummaryJson(): string {
    return process.env.EXECUTION_SUMMARY_JSON || 'test-results/execution-summary.json';
  }

  static get executionSummaryMarkdown(): string {
    return process.env.EXECUTION_SUMMARY_MD || 'test-results/execution-summary.md';
  }
}
