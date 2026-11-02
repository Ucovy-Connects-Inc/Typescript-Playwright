import { test, expect } from '@playwright/test';

test.describe('Outlook Email Verification - Local Execution', () => {

  test('Live Demo: Login to Outlook and find email links', async ({ page }) => {
    console.log('🎭 OUTLOOK EMAIL VERIFICATION - LIVE DEMO');
    console.log('==========================================');
    
    // Step 1: Navigate to Outlook
    console.log('1️⃣ Opening Outlook Web App...');
    await page.goto('https://outlook.live.com', { waitUntil: 'networkidle' });
    
    console.log('🔍 Please enter your email credentials when prompted');
    console.log('⏳ Waiting for you to login manually...');
    
    // Wait for email input field
    try {
      await page.waitForSelector('input[type="email"]', { timeout: 10000 });
      console.log('✅ Login page loaded');
      
      // Pause for manual login
      console.log('👤 Please login manually in the browser window');
      console.log('📧 Enter your email address and password');
      console.log('🔐 Complete any 2FA if required');
      console.log('⏰ Test will continue after you reach your inbox...');
      
      // Wait for inbox to load (looking for typical Outlook inbox elements)
      await page.waitForSelector('[data-testid="message-list"]', { timeout: 60000 });
      console.log('✅ Inbox loaded successfully!');
      
    } catch (error) {
      console.log('⚠️ Login form not found or already logged in');
    }
    
    // Step 2: Look for emails
    try {
      console.log('2️⃣ Searching for emails...');
      
      // Wait for email list
      const emailList = page.locator('[data-testid="message-list"] [role="listitem"]');
      const emailCount = await emailList.count();
      
      console.log(`📬 Found ${emailCount} emails in your inbox`);
      
      if (emailCount > 0) {
        console.log('3️⃣ Clicking on the first email...');
        await emailList.first().click();
        
        // Wait for email content to load
        await page.waitForSelector('[data-testid="message-body"]', { timeout: 15000 });
        console.log('✅ Email content loaded');
        
        // Step 3: Look for links in the email
        console.log('4️⃣ Searching for links in the email...');
        
        const emailBody = page.locator('[data-testid="message-body"]');
        const links = emailBody.locator('a');
        const linkCount = await links.count();
        
        console.log(`🔗 Found ${linkCount} links in the email`);
        
        // Display all links found
        for (let i = 0; i < Math.min(linkCount, 5); i++) {
          const link = links.nth(i);
          const href = await link.getAttribute('href');
          const text = await link.textContent();
          console.log(`   Link ${i + 1}: "${text}" → ${href}`);
        }
        
        // Step 4: Demo link extraction
        if (linkCount > 0) {
          console.log('5️⃣ Demonstrating link click...');
          const firstLink = links.first();
          const linkText = await firstLink.textContent();
          const linkHref = await firstLink.getAttribute('href');
          
          console.log(`🎯 Selected link: "${linkText}" → ${linkHref}`);
          
          // Ask for confirmation before clicking
          console.log('⏳ Pausing for 5 seconds before clicking the link...');
          await page.waitForTimeout(5000);
          
          // Option 1: Click the link directly
          try {
            await firstLink.click({ timeout: 5000 });
            console.log('✅ Link clicked successfully');
            
            // Wait for new page to load
            await page.waitForLoadState('networkidle');
            const newUrl = page.url();
            const newTitle = await page.title();
            
            console.log(`🌐 Navigated to: ${newUrl}`);
            console.log(`📄 Page title: ${newTitle}`);
            
          } catch (error) {
            console.log('⚠️ Could not click link directly, trying navigation...');
            
            // Option 2: Navigate to the URL
            if (linkHref && linkHref.startsWith('http')) {
              await page.goto(linkHref);
              console.log(`✅ Navigated to: ${linkHref}`);
            }
          }
        }
        
      } else {
        console.log('📭 No emails found in inbox');
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log(`❌ Error accessing emails: ${errorMessage}`);
      console.log('💡 Make sure you are logged into Outlook and have emails in your inbox');
    }
    
    // Step 5: Keep browser open for manual inspection
    console.log('6️⃣ Test complete! Browser will stay open for 30 seconds...');
    console.log('🔍 You can manually inspect the email and links');
    console.log('📱 Check the browser window to see the current state');
    
    await page.waitForTimeout(30000); // Keep browser open for 30 seconds
  });

  test('Guided: Trigger email and verify link', async ({ page }) => {
    console.log('🎯 GUIDED EMAIL VERIFICATION WORKFLOW');
    console.log('====================================');
    
    // Step 1: Trigger an action that sends email
    console.log('1️⃣ Triggering password reset email...');
    await page.goto('https://ecommerce-playground.lambdatest.io/index.php?route=account/forgotten');
    
    // Use your actual email address here
    const testEmail = 'your-email@outlook.com'; // Replace with your email
    console.log(`📧 Using email: ${testEmail}`);
    
    await page.fill('#input-email', testEmail);
    await page.click('input[type="submit"]');
    
    // Verify success message
    const successMessage = page.locator('.alert-success');
    await expect(successMessage).toBeVisible();
    console.log('✅ Password reset email sent!');
    
    console.log('2️⃣ Now check your email inbox...');
    console.log('📬 Look for email with subject like "Password Reset" or "Reset Your Password"');
    console.log('🔗 Copy the reset link from the email');
    
    // Pause for manual email checking
    console.log('⏳ Pausing for 60 seconds to check email...');
    console.log('💡 Open another browser tab and check your Outlook inbox');
    console.log('📋 Copy the password reset link when you find it');
    
    await page.waitForTimeout(60000);
    
    // Demo what to do with the reset link
    console.log('3️⃣ Once you have the reset link:');
    console.log('   - Paste it in your test');
    console.log('   - Navigate to the link'); 
    console.log('   - Fill out the new password form');
    console.log('   - Verify password was reset successfully');
    
    // Example code for using the reset link
    const exampleCode = `
// Example: Using the reset link in your test
const resetLink = 'PASTE_YOUR_RESET_LINK_HERE';

await page.goto(resetLink);
await page.fill('#input-password', 'newPassword123');
await page.fill('#input-confirm', 'newPassword123');
await page.click('input[type="submit"]');

await expect(page.locator('text=Password updated')).toBeVisible();
console.log('✅ Password reset successful');
`;
    
    console.log(exampleCode);
  });

  test('Interactive: Manual Outlook verification', async ({ page }) => {
    console.log('🖱️ INTERACTIVE OUTLOOK EMAIL VERIFICATION');
    console.log('=========================================');
    
    // This test opens Outlook and waits for you to manually verify emails
    console.log('1️⃣ Opening Outlook in a new tab...');
    
    // Open Outlook
    await page.goto('https://outlook.live.com');
    console.log('✅ Outlook opened');
    
    console.log('\n📋 MANUAL STEPS:');
    console.log('1. Login to your Outlook account');
    console.log('2. Find the email you want to verify');
    console.log('3. Look for verification/confirmation links');
    console.log('4. Copy the link URL');
    console.log('5. Test the link in another browser tab');
    
    console.log('\n🔍 WHAT TO LOOK FOR:');
    console.log('- "Verify Email" or "Confirm Account" buttons/links');
    console.log('- "Reset Password" links');
    console.log('- "Activate Account" links'); 
    console.log('- Order confirmation links');
    console.log('- Newsletter unsubscribe links');
    
    console.log('\n⏰ Browser will stay open for 2 minutes for manual verification...');
    console.log('💡 Use this time to practice finding and testing email links');
    
    // Keep browser open for manual testing
    await page.waitForTimeout(120000); // 2 minutes
    
    console.log('✅ Manual verification session complete');
  });

});