# 🔄 Authentication & Verification Flow

## 1️⃣ Registration
- User registers with email/password (credentials provider).
- Generates verification token, sends email via Resend.
- Until verified, user cannot log in.

## 2️⃣ OAuth login
- Google/GitHub OAuth via Auth.js provider.
- Verified instantly by OAuth.

## 3️⃣ Email verification
- Clicking email link sets `emailVerified` true.

## 4️⃣ Forgot password
- Sends reset link via Resend. User sets new password.

## 5️⃣ Two-factor authentication (2FA)
- User can enable 2FA in settings. Uses TOTP (Google Authenticator).
- On login, prompts for 6-digit code.

## 6️⃣ Sessions
- JWT managed by Auth.js, extended with roles & 2FA checks via callbacks.
