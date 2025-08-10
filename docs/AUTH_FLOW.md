# 🔄 Authentication & Verification Flow

## 1️⃣ Registration
- User registers with email/password (Credentials Provider).
- Generates a verification token and sends a verification email via Resend.
- User cannot log in until email is verified.

## 2️⃣ OAuth Login
- Supports Google and GitHub OAuth via Auth.js providers.
- OAuth users are considered verified immediately upon successful login.

## 3️⃣ Email Verification
- Clicking the verification link in the email sets `emailVerified` to true in the database.

## 4️⃣ Forgot Password
- User requests password reset.
- Sends a password reset link via Resend.
- User sets a new password using the reset link.

## 5️⃣ Two-Factor Authentication (2FA)
- Users can enable 2FA in account settings.
- Implements TOTP (compatible with Google Authenticator and similar apps).
- Login flow prompts for a 6-digit code if 2FA is enabled.

## 6️⃣ Sessions & Security
- Sessions are managed using JWT tokens via Auth.js.
- JWT tokens are extended with user roles and 2FA verification status using Auth.js callbacks.
- Middleware verifies session and 2FA status for protected routes.

