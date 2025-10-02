export class Config {
  static readonly BASE_URL = 'https://ecommerce-playground.lambdatest.io';
  static readonly TIMEOUT = {
    SHORT: 5000,
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
}