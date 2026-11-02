import { test, expect } from '@playwright/test';

test.describe('Email Link Verification - Simple Example', () => {

  test('Demo: How to verify email links in Outlook', async ({ page }) => {
    console.log('📧 EMAIL LINK VERIFICATION DEMO');
    console.log('================================');
    
    // This test demonstrates the approach without requiring real email credentials
    // In real scenarios, replace with actual email verification
    
    // Step 1: Trigger an action that sends an email
    console.log('1️⃣ Triggering email-sending action...');
    await page.goto('https://ecommerce-playground.lambdatest.io/index.php?route=account/forgotten');
    
    // Fill the forgot password form (this would normally send an email)
    await page.fill('#input-email', 'demo@example.com');
    await page.click('input[type="submit"]');
    
    // Verify the success message appears
    const successMessage = page.locator('.alert-success');
    await expect(successMessage).toBeVisible();
    console.log('✅ Password reset email would be sent');
    
    // Step 2: Simulate email verification process
    console.log('2️⃣ In real scenario, you would now:');
    console.log('   - Check email inbox for reset link');
    console.log('   - Extract the reset link from email content');
    console.log('   - Navigate to the reset link');
    console.log('   - Complete the password reset process');
    
    // Step 3: Demo the actual email verification code structure
    console.log('3️⃣ Email verification code would look like:');
    
    const demoCode = `
// Real implementation:
const { EmailVerification } = require('../src/utils/EmailVerification');

// Method 1: Direct Outlook Web Access
const resetLink = await EmailVerification.verifyEmailLinkInOutlookWeb(
  page,
  'demo@example.com',      // Your email
  'your-password',         // Your password  
  'Reset Password'         // Link text to find
);

// Method 2: Test the extracted link
if (resetLink) {
  await page.goto(resetLink);
  await page.fill('#new-password', 'newPassword123');
  await page.click('#submit');
  await expect(page.locator('text=Password updated')).toBeVisible();
}
`;
    
    console.log(demoCode);
    
    // Step 4: Show how to extract verification links from email content
    console.log('4️⃣ Example: Extract verification link from email HTML');
    
    const sampleEmail = `
      <html>
        <body>
          <h2>Password Reset Request</h2>
          <p>Click the link below to reset your password:</p>
          <a href="https://ecommerce-playground.lambdatest.io/reset?token=abc123xyz">Reset Password</a>
          <p>This link expires in 24 hours.</p>
        </body>
      </html>
    `;
    
    // Extract link using regex (demo)
    const linkRegex = /<a[^>]*href=["']([^"']*?)["'][^>]*>([^<]*?)<\/a>/gi;
    const match = linkRegex.exec(sampleEmail);
    
    if (match) {
      const extractedUrl = match[1];
      const linkText = match[2];
      console.log(`🔗 Extracted link: ${extractedUrl}`);
      console.log(`📝 Link text: ${linkText}`);
      
      // Demo: Test the extracted link
      console.log('5️⃣ Testing extracted link...');
      
      // Navigate to a demo URL (since we don't have real reset token)
      await page.goto('https://ecommerce-playground.lambdatest.io/index.php?route=account/login');
      console.log('✅ Link navigation successful');
      
      // In real scenario, you'd verify the reset page loaded correctly
      await expect(page.locator('h2:has-text("Returning Customer")')).toBeVisible();
      console.log('✅ Reset page elements verified');
    }
    
    console.log('\n🎯 SUMMARY:');
    console.log('- Email verification is crucial for testing registration, password reset, etc.');
    console.log('- Use EmailVerification.verifyEmailLinkInOutlookWeb() for direct email access');
    console.log('- Always verify the extracted link actually works');
    console.log('- Consider using email APIs for more reliable automation');
    console.log('\n📚 See docs/EMAIL_VERIFICATION_GUIDE.md for complete setup instructions');
  });

  test('Practice: Manual email verification steps', async ({ page }) => {
    // This test guides you through manual email verification
    console.log('\n🎯 MANUAL EMAIL VERIFICATION PRACTICE');
    console.log('=====================================');
    
    console.log('1. Open Outlook in another browser tab');
    console.log('2. Trigger an email-sending action in your app');
    console.log('3. Check email inbox for the email');
    console.log('4. Copy the verification link from email');
    console.log('5. Paste and test the link in your automation');
    
    // Simulate triggering email action
    await page.goto('https://ecommerce-playground.lambdatest.io/index.php?route=account/register');
    console.log('📍 Navigate to registration page');
    
    // Show form fields for email-triggering action
    await page.fill('#input-firstname', 'Test');
    await page.fill('#input-lastname', 'User'); 
    await page.fill('#input-email', 'test@example.com');
    console.log('📝 Fill registration form (would trigger confirmation email)');
    
    console.log('\n🔄 Next steps in real scenario:');
    console.log('1. Submit form → email sent');
    console.log('2. Check email → find verification link'); 
    console.log('3. Copy link → paste in test');
    console.log('4. Navigate to link → verify account activated');
    
    console.log('\n💡 TIP: Use environment variables for email credentials');
    console.log('💡 TIP: Create dedicated test email accounts');
    console.log('💡 TIP: Consider MailHog for local email testing');
  });

});