# 📧 Email Link Verification in Playwright

This guide shows you how to verify links received in Outlook emails during your automated tests.

## 🚀 Quick Start

### Method 1: Outlook Web App (Simplest)

```typescript
import { EmailVerification } from '../src/utils/EmailVerification';

test('verify email link', async ({ page }) => {
  // Get link from latest email
  const linkUrl = await EmailVerification.verifyEmailLinkInOutlookWeb(
    page,
    'your-email@outlook.com',
    'your-password',
    'Verify Account'  // Text of link to find
  );
  
  // Test the link works
  if (linkUrl) {
    await EmailVerification.testEmailLink(page, linkUrl);
  }
});
```

### Method 2: Microsoft Graph API (Recommended for Production)

1. **Setup Azure App Registration:**
   - Go to Azure Portal → App registrations → New registration
   - Name: "Playwright Email Tests"
   - Grant permissions: `Mail.Read`, `User.Read`
   - Create client secret

2. **Use in test:**
```typescript
const linkUrl = await EmailVerification.verifyEmailLinkViaAPI(
  'your-access-token',
  'verification'  // URL pattern to find
);
```

## 🛠️ Setup Instructions

### 1. Environment Variables
Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

### 2. Install Additional Dependencies (if needed)
```bash
npm install dotenv @azure/msal-node
```

### 3. Update Playwright Config
Add to `playwright.config.ts`:

```typescript
// Load environment variables
require('dotenv').config();

export default defineConfig({
  // ... existing config
  use: {
    // ... existing use config
    extraHTTPHeaders: {
      // Add any needed headers for email service authentication
    }
  }
});
```

## 📝 Common Use Cases

### Registration Confirmation
```typescript
test('user registration with email verification', async ({ page }) => {
  // 1. Fill registration form
  await page.goto('/register');
  await page.fill('#email', 'test@example.com');
  await page.click('#submit');
  
  // 2. Check email for verification link
  const verificationLink = await EmailVerification.verifyEmailLinkInOutlookWeb(
    page,
    'test@example.com',
    'password',
    'Confirm Email'
  );
  
  // 3. Click verification link
  if (verificationLink) {
    await page.goto(verificationLink);
    await expect(page.locator('text=Email verified')).toBeVisible();
  }
});
```

### Password Reset
```typescript
test('password reset flow', async ({ page }) => {
  // 1. Request password reset
  await page.goto('/forgot-password');
  await page.fill('#email', 'user@example.com');
  await page.click('#submit');
  
  // 2. Get reset link from email
  const resetLink = await EmailVerification.verifyEmailLinkInOutlookWeb(
    page,
    'user@example.com',
    'password',
    'Reset Password'
  );
  
  // 3. Use reset link
  if (resetLink) {
    await page.goto(resetLink);
    await page.fill('#new-password', 'newpassword123');
    await page.click('#submit');
  }
});
```

### Order Confirmation
```typescript
test('order confirmation email', async ({ page }) => {
  // 1. Place order
  await page.goto('/checkout');
  // ... complete order process
  
  // 2. Verify order confirmation email
  const orderLink = await EmailVerification.verifyEmailLinkInOutlookWeb(
    page,
    'customer@example.com',
    'password',
    'View Order'
  );
  
  // 3. Check order details
  if (orderLink) {
    await EmailVerification.testEmailLink(
      page,
      orderLink,
      'Order Details',
      'Order Number'
    );
  }
});
```

## 🔧 Troubleshooting

### Common Issues:

1. **Two-Factor Authentication**
   - Disable 2FA for test account, or
   - Use app-specific passwords, or
   - Use Microsoft Graph API instead

2. **Email Not Found**
   - Add delays: `await page.waitForTimeout(5000)`
   - Check spam folder
   - Use email service APIs for more reliable access

3. **Link Extraction Fails**
   - Check email HTML structure
   - Update selectors in `verifyEmailLinkInOutlookWeb`
   - Use regex patterns in `extractVerificationLink`

4. **Outlook Security Blocks**
   - Use dedicated test email account
   - Consider using MailHog or similar for local testing

### Best Practices:

- ✅ Use dedicated email accounts for testing
- ✅ Implement retry logic for email checks
- ✅ Clean up test emails after tests
- ✅ Use email service APIs when possible
- ❌ Don't use personal email accounts
- ❌ Don't hardcode credentials in tests

## 🔗 Alternative Solutions

### 1. MailHog (Local Email Testing)
```bash
docker run -p 8025:8025 -p 1025:1025 mailhog/mailhog
```

### 2. Mailtrap (Email Testing Service)
```typescript
// Configure your app to send emails to Mailtrap in test environment
// Then use Mailtrap API to verify emails
```

### 3. Mock Email Service
```typescript
// Intercept email sending in your app during tests
// Store emails in memory/file for verification
```

## 📊 Running the Tests

```bash
# Run all email verification tests
npx playwright test tests/email-verification.spec.ts

# Run specific email test
npx playwright test tests/email-verification.spec.ts -g "verify email link"

# Run with headed browser (to see email login)
npx playwright test tests/email-verification.spec.ts --headed
```