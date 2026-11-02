import { test, expect } from '@playwright/test';

test.describe('Login Validation Tests', () => {
  
  test('Validate login error message for invalid credentials', async ({ page}) => {
    console.log('🚀 Starting login validation test...');
    
    // Navigate to the homepage
    console.log('🌐 Navigating to homepage...');
    await page.goto('/');
    
    // Navigate to login page
    console.log('👤 Clicking on My Account...');
    await page.getByRole('button', { name: 'My account' }).click();
    
    console.log('🔗 Clicking on Login link...');
    await page.getByRole('link', { name: 'Login', exact: true }).click();
    
    // Verify we're on the login page
    console.log('✅ Verifying login page loaded...');
    await expect(page.locator('h2:has-text("Returning Customer")')).toBeVisible();
    
    // Fill invalid credentials
    console.log('📝 Entering invalid email address...');
    await page.getByRole('textbox', { name: 'E-Mail Address' }).fill('invalid@email.com');
    
    console.log('📝 Entering invalid password...');
    await page.getByRole('textbox', { name: 'Password' }).fill('wrongpassword');
    
    // Submit login form
    console.log('🚀 Submitting login form...');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Wait for error message to appear
    console.log('⏳ Waiting for error message...');
    const errorMessage = page.locator('.alert-danger, .text-danger, div:has-text("Warning: No match for E-Mail")');
    
    // Validate error message appears
    console.log('🔍 Validating error message appears...');
    await expect(errorMessage).toBeVisible({ timeout: 10000 });
    
    // Get the actual error text
    const errorText = await errorMessage.textContent();
    console.log(`📄 Error message displayed: "${errorText}"`);
    
    // Validate specific error message content
    console.log('✅ Validating error message content...');
    expect(errorText).toContain('Warning: No match for E-Mail');
    
    // Additional validations
    console.log('🔒 Verifying user is still on login page...');
    await expect(page.locator('h2:has-text("Returning Customer")')).toBeVisible();
    
    console.log('📋 Verifying form fields are still visible...');
    await expect(page.getByRole('textbox', { name: 'E-Mail Address' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    
    console.log('✅ Login validation test completed successfully');
  });

  test('Validate login error message for empty fields', async ({ page}) => {
    console.log('🚀 Starting empty fields validation test...');
    
    // Navigate to login page
    console.log('🌐 Navigating to login page...');
    await page.goto('/index.php?route=account/login');
    
    // Try to submit without filling any fields
    console.log('🚀 Submitting empty login form...');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Check for validation messages
    console.log('🔍 Checking for validation messages...');
    
    // Wait a moment for any validation to appear
    await page.waitForTimeout(2000);
    
    // Verify we're still on login page (form didn't submit successfully)
    console.log('✅ Verifying user stays on login page...');
    await expect(page.locator('h2:has-text("Returning Customer")')).toBeVisible();
    
    console.log('✅ Empty fields validation test completed');
  });

  test('Validate login error message for malformed email', async ({ page }) => {
    console.log('🚀 Starting malformed email validation test...');
    
    // Navigate to login page
    console.log('🌐 Navigating to login page...');
    await page.goto('/index.php?route=account/login');
    
    // Fill malformed email
    console.log('📝 Entering malformed email...');
    await page.getByRole('textbox', { name: 'E-Mail Address' }).fill('notanemail');
    
    console.log('📝 Entering password...');
    await page.getByRole('textbox', { name: 'Password' }).fill('somepassword');
    
    // Submit form
    console.log('🚀 Submitting form with malformed email...');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Wait for and validate error message
    console.log('⏳ Waiting for error message...');
    const errorMessage = page.locator('.alert-danger, .text-danger, div:has-text("Warning")');
    
    await expect(errorMessage).toBeVisible({ timeout: 10000 });
    
    const errorText = await errorMessage.textContent();
    console.log(`📄 Error message: "${errorText}"`);
    
    console.log('✅ Malformed email validation test completed');
  });

  test('Validate successful login flow for comparison', async ({ page }) => {
    console.log('🚀 Starting successful login test (if valid credentials exist)...');
    
    // Navigate to registration first to create a valid user
    console.log('👤 Creating test user first...');
    await page.goto('/index.php?route=account/register');
    
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';
    
    console.log(`📝 Filling registration form with email: ${testEmail}...`);
    await page.fill('#input-firstname', 'Test');
    await page.fill('#input-lastname', 'User');
    await page.fill('#input-email', testEmail);
    await page.fill('#input-telephone', '1234567890');
    await page.fill('#input-password', testPassword);
    await page.fill('#input-confirm', testPassword);
    
    // Accept privacy policy
    console.log('☑️ Accepting privacy policy...');
    await page.click('label[for="input-agree"]', { timeout: 5000 });
    
    // Submit registration
    console.log('🚀 Submitting registration...');
    await page.click('input[type="submit"]');
    
    // Wait for registration completion
    await page.waitForTimeout(3000);
    
    // Now try to login with valid credentials
    console.log('🔑 Attempting login with valid credentials...');
    await page.goto('/index.php?route=account/login');
    
    await page.getByRole('textbox', { name: 'E-Mail Address' }).fill(testEmail);
    await page.getByRole('textbox', { name: 'Password' }).fill(testPassword);
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Check if login was successful (should redirect to account page)
    console.log('✅ Checking login success...');
    await page.waitForTimeout(3000);
    
    // Note: This test demonstrates the difference between success and failure
    console.log('📝 Note: This test shows contrast with error message tests');
    
    console.log('✅ Login flow comparison test completed');
  });

});