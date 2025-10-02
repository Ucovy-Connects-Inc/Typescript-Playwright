export class TestData {
  static generateUniqueEmail(): string {
    const timestamp = Date.now();
    return `testuser_${timestamp}@example.com`;
  }

  static readonly VALID_USER = {
    firstName: 'John',
    lastName: 'Doe',
    telephone: '+1234567890',
    password: 'SecurePass123!',
  };

  static readonly INVALID_USER = {
    email: 'invalid-email-format',
    password: '123',
    firstName: '',
    telephone: 'invalid-phone',
  };

  static readonly SEARCH_TERMS = ['MacBook', 'iPhone', 'Samsung', 'Laptop'];

  static readonly PRODUCT_CATEGORIES = [
    'Laptops & Notebooks',
    'Phones & PDAs',
    'Tablets',
  ];

  static readonly BILLING_ADDRESS = {
    firstName: 'John',
    lastName: 'Doe',
    address1: '123 Test Street',
    city: 'Test City',
    postCode: '12345',
    country: 'United States',
    state: 'California',
  };
}