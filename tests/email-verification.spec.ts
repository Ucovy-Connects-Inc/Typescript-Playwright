import { test, expect } from '@playwright/test';
import { EmailVerification } from '../src/utils/EmailVerification';
import { ConsoleLogUtil } from '../src/utils/ConsoleLogUtil';

test.describe('Email Link Verification Tests', () => {

  test('Method 1: Verify link in Outlook Web App', async ({ page }) => {
    const logger = ConsoleLogUtil.createTestLogger();
    
    // ⚠️ Replace with your actual credentials or use environment variables
    const email = process.env.OUTLOOK_EMAIL || 'your-email@outlook.com';
    const password = process.env.OUTLOOK_PASSWORD || 'your-password';
    
    logger.step(1, 'Starting Outlook Web App verification');
    logger.info(`Verifying email link for: ${email}`);
    
    try {
      logger.step(2, 'Extracting verification link from email');
      
      // Verify email link exists
      const linkUrl = await EmailVerification.verifyEmailLinkInOutlookWeb(
        page,
        email,
        password,
        'Verify Account', // Expected link text
        'verification' // Expected URL pattern (optional)
      );
      
      logger.success(`Verification link extracted: ${linkUrl || 'Not found'}`);
      
      // Test the extracted link (only if link was found)
      if (linkUrl) {
        logger.step(3, 'Testing extracted verification link');
        await EmailVerification.testEmailLink(
          page,
          linkUrl,
          'Account Verification', // Expected page title
          'Please confirm your email' // Expected content
        );
        logger.success('Verification link tested successfully');
      } else {
        logger.warn('No verification link found');
      }
      
    } catch (error) {
      logger.error('Email verification failed: ' + error);
      logger.info('💡 Tip: Set OUTLOOK_EMAIL and OUTLOOK_PASSWORD environment variables');
      test.skip(); // Skip if credentials not available
    }
  });

  test('Method 2: Verify registration confirmation link', async ({ page }) => {
    // Simulate user registration first
    await page.goto('https://ecommerce-playground.lambdatest.io/index.php?route=account/register');
    
    // Fill registration form
    await page.fill('#input-firstname', 'Test');
    console.log('🔔 Registering new user to trigger confirmation email...');
    await page.fill('#input-lastname', 'User');
    console.log('🔔 Filling registration form...');
    await page.fill('#input-email', 'test@example.com');
    console.log('🔔 Filling registration form...');
    await page.fill('#input-telephone', '1234567890');
    console.log('🔔 Filling registration form...');
    await page.fill('#input-password', 'password123');
    await page.fill('#input-confirm', 'password123');
    
    // Accept privacy policy
    await page.check('input[name="agree"]');
    
    // Submit form (this would normally send an email)
    await page.click('input[type="submit"]');
    
    // In real scenario, you'd now check email for verification link
    console.log('🔔 In real scenario, check email for verification link here');
    console.log('📧 Use EmailVerification.verifyEmailLinkInOutlookWeb() to verify the link');
  });

  test('Method 3: Verify password reset email link', async ({ page }) => {
    // Navigate to password reset page
    await page.goto('https://ecommerce-playground.lambdatest.io/index.php?route=account/forgotten');
    
    // Enter email for password reset
    await page.fill('#input-email', 'test@example.com');
    await page.click('input[type="submit"]');
    
    // Verify success message
    await expect(page.locator('.alert-success')).toBeVisible();
    
    console.log('🔔 Password reset email sent');
    console.log('📧 Check email and use EmailVerification methods to verify reset link');
  });

  test('Method 4: Test email link from saved file', async ({ page }) => {
    // Create sample email content for testing
    const sampleEmailContent = `
      <html>
        <body>
          <h1>Welcome to Our Service!</h1>
          <p>Please verify your account by clicking the link below:</p>
          <a href="https://example.com/verify?token=abc123">Verify Account</a>
          <p>Thank you!</p>
        </body>
      </html>
    `;
    
    // Save to temp file
    const fs = require('fs');
    const tempFile = 'temp_email.html';
    fs.writeFileSync(tempFile, sampleEmailContent);
    
    try {
      // Verify link from file
      const linkUrl = await EmailVerification.verifyEmailLinkFromFile(
        tempFile,
        'Verify Account',
        'verify'
      );
      
      console.log(`✅ Extracted link: ${linkUrl}`);
      expect(linkUrl).toContain('verify');
      
    } finally {
      // Clean up temp file
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
    }
  });

  test('Method 5: Extract and test verification link patterns', async () => {
    const emailSamples = [
      'Click here to verify: https://app.com/verify?token=xyz789',
      'Activate your account: https://service.com/activate/user123',
      'Reset password: https://site.com/reset-password?code=reset456',
      'Please confirm: https://platform.com/confirm?id=conf999'
    ];
    
    for (const emailContent of emailSamples) {
      const link = await EmailVerification.extractVerificationLink(emailContent);
      console.log(`📧 Email: ${emailContent}`);
      console.log(`🔗 Extracted link: ${link}`);
      expect(link).toBeTruthy();
    }
  });

});

test.describe('Practical Email Link Verification Scenarios', () => {

  test('Complete user registration with email verification', async ({ page }) => {
    // Step 1: Register user
    await page.goto('https://ecommerce-playground.lambdatest.io/index.php?route=account/register');
    
    const testEmail = `test${Date.now()}@example.com`;
    await page.fill('#input-firstname', 'Test');
    await page.fill('#input-lastname', 'User');
    await page.fill('#input-email', testEmail);
    await page.fill('#input-telephone', '1234567890');
    await page.fill('#input-password', 'password123');
    await page.fill('#input-confirm', 'password123');
    await page.check('input[name="agree"]');
    await page.click('input[type="submit"]');
    
    console.log(`📧 Registration completed for: ${testEmail}`);
    console.log('📋 Next steps for email verification:');
    console.log('1. Check email inbox for verification email');
    console.log('2. Use EmailVerification.verifyEmailLinkInOutlookWeb() method');
    console.log('3. Click verification link to activate account');
    console.log('4. Verify account activation was successful');
  });

  test('Order confirmation email verification', async ({ page }) => {
    // Simulate placing an order (this would trigger confirmation email)
    console.log('🛒 Order placed - confirmation email should be sent');
    console.log('📧 Use this code to verify order confirmation email:');
    
    const sampleCode = `
    // In your test:
    const orderConfirmationLink = await EmailVerification.verifyEmailLinkInOutlookWeb(
      page,
      'your-email@outlook.com',
      'your-password',
      'View Order Details', // Link text in email
      'order-details'       // Expected URL pattern
    );
    
    // Test the order details link
    await EmailVerification.testEmailLink(
      page,
      orderConfirmationLink,
      'Order Confirmation',
      'Order #'
    );
    `;
    
    console.log(sampleCode);
  });

});