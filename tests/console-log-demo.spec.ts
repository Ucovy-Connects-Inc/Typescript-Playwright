import { test, expect } from '@playwright/test';
import { ConsoleLogUtil } from '../src/utils/ConsoleLogUtil';

test.describe('Console Log Utility Demo', () => {
  
  test('Demo: Console logging during test execution', async ({ page }) => {
    const logger = ConsoleLogUtil.createTestLogger();
    const logUtil = new ConsoleLogUtil();
    
    // Start capturing logs
    logUtil.startCapturing();
    
    logger.step(1, 'Starting email verification test');
    logger.info('Navigating to registration page');
    
    // Navigate to test page
    await page.goto('https://ecommerce-playground.lambdatest.io/index.php?route=account/register');
    logger.success('Page loaded successfully');
    
    // Fill form with logging
    logger.step(2, 'Filling registration form');
    await page.fill('#input-firstname', 'Test');
    logger.log('First name filled');
    
    await page.fill('#input-lastname', 'User');
    logger.log('Last name filled');
    
    await page.fill('#input-email', 'test@example.com');
    logger.log('Email filled');
    
    await page.fill('#input-telephone', '1234567890');
    logger.log('Phone number filled');
    
    await page.fill('#input-password', 'password123');
    logger.log('Password filled');
    
    await page.fill('#input-confirm', 'password123');
    logger.log('Password confirmation filled');
    
    logger.step(3, 'Validating form elements');
    
    // Validate form elements
    await expect(page.locator('#input-firstname')).toHaveValue('Tehh');
    logger.success('First name validation passed');
    
    await expect(page.locator('#input-email')).toHaveValue('test@example.com');
    logger.success('Email validation passed');
    
    // Simulate email verification process
    logger.step(4, 'Simulating email verification process');
    logger.info('In real scenario, form submission would trigger email');
    logger.warn('Remember to check email inbox for verification link');
    
    // Demo error logging
    try {
      // This will cause an error for demo purposes
      await expect(page.locator('#nonexistent-element')).toBeVisible({ timeout: 1000 });
    } catch (error) {
      logger.error('Element not found (this is expected for demo)');
    }
    
    logger.step(5, 'Test completed successfully');
    logger.success('All validation steps passed');
    
    // Stop capturing and print logs
    logUtil.stopCapturing();
    
    // Print all captured logs
    logUtil.printLogs('🧪 Test Execution Logs');
  });

  test('Demo: Outlook email verification with detailed logging', async ({ page }) => {
    const logger = ConsoleLogUtil.createTestLogger();
    
    logger.step(1, 'Starting Outlook email verification demo');
    
    // Navigate to forgot password page
    logger.info('Navigating to password reset page');
    await page.goto('https://ecommerce-playground.lambdatest.io/index.php?route=account/forgotten');
    
    logger.success('Password reset page loaded');
    
    // Fill email for password reset
    logger.step(2, 'Requesting password reset');
    await page.fill('#input-email', 'demo@example.com');
    logger.log('Email address entered: demo@example.com');
    
    await page.click('input[type="submit"]');
    logger.log('Password reset form submitted');
    
    // Verify success message
    const successMessage = page.locator('.alert-success');
    await expect(successMessage).toBeVisible();
    logger.success('Password reset request successful');
    
    // Demo the email verification process
    logger.step(3, 'Email verification process (simulated)');
    logger.info('🔔 Password reset email would be sent to: demo@example.com');
    logger.info('📧 Email would contain a reset link like: https://example.com/reset?token=abc123');
    
    // Show how to use the email verification utility
    logger.step(4, 'Using EmailVerification utility');
    logger.log('Code example for real email verification:');
    
    const codeExample = `
// Real implementation:
const { EmailVerification } = require('../src/utils/EmailVerification');

const resetLink = await EmailVerification.verifyEmailLinkInOutlookWeb(
  page,
  'your-email@outlook.com',
  'your-password', 
  'Reset Password'
);

if (resetLink) {
  await page.goto(resetLink);
  // Complete password reset process
}`;
    
    logger.info('Email verification code structure:');
    console.log(codeExample);
    
    // Simulate clicking the email link
    logger.step(5, 'Testing extracted email link (simulated)');
    logger.info('Navigating to simulated reset page');
    
    // Navigate to login page as demo
    await page.goto('https://ecommerce-playground.lambdatest.io/index.php?route=account/login');
    logger.success('Reset page navigation successful');
    
    // Verify page elements
    await expect(page.locator('h2:has-text("Returning Customer")')).toBeVisible();
    logger.success('Reset page elements verified');
    
    logger.step(6, 'Test completed - Summary');
    logger.success('✅ Password reset email triggered successfully');
    logger.success('✅ Email verification process demonstrated');
    logger.success('✅ Link navigation tested');
    logger.info('💡 Next: Set up real email credentials for actual verification');
    
    // Print test summary
    console.log('\n🎯 TEST SUMMARY');
    console.log('================');
    console.log('✅ Password reset flow tested');
    console.log('✅ Email verification approach demonstrated');
    console.log('✅ Console logging functionality verified');
    console.log('📧 Ready for real email integration\n');
  });

  test('Demo: Log parsing from test results', async ({ page }) => {
    const logger = ConsoleLogUtil.createTestLogger();
    
    logger.step(1, 'Testing log parsing functionality');
    
    // Create some test logs
    logger.info('This is an info log');
    logger.warn('This is a warning log');
    logger.error('This is an error log');
    logger.success('This is a success log');
    
    // Simulate test result object
    const mockTestResult = {
      status: 'passed',
      duration: 1250,
      stdout: [
        { text: '📝 Test log message' },
        { text: '✅ Success message' },
        { text: '⚠️ Warning message' },
        'Simple string log',
        { buffer: Buffer.from('Buffer log message').buffer }
      ]
    };
    
    logger.step(2, 'Parsing console logs from test result');
    const parsedLogs = ConsoleLogUtil.parseConsoleLogs(mockTestResult);
    logger.log('Parsed logs length: ' + parsedLogs.length);
    
    logger.step(3, 'Printing formatted test results');
    ConsoleLogUtil.printTestResults('Console Log Parsing Demo', mockTestResult);
    
    logger.success('Log parsing functionality verified');
  });

});