
# Authentication Architecture & Design

## Overview

This document explains the design rationale and architecture of the authentication system used in this project, built with **NextAuth.js (Auth.js)** and **Prisma ORM**. The system supports multiple authentication methods, enforces email verification, and prevents account conflicts with the same email across different login methods.

---

## Why This Authentication Setup?

### 1. Supporting Multiple Login Methods (OAuth + Credentials)

- **OAuth Providers (Google, GitHub)** are popular, secure, and user-friendly options for authentication. They allow users to sign in using existing accounts without remembering new passwords.  
- **Credentials Provider** supports traditional email/password login, important for users who prefer or require classic authentication methods.

**Benefits:**

- Flexibility: Users can choose their preferred login method.  
- Convenience: OAuth reduces friction by leveraging trusted third-party identity providers.  
- Security: OAuth providers verify user emails, reducing fake or malicious accounts.

---

### 2. Email Verification Enforcement

- For **credential-based accounts**, email verification is critical to ensure users control the email address they register with.  
- **OAuth accounts** are trusted to have already verified the user's email on their platform (Google, GitHub). Therefore, upon first OAuth login, `emailVerified` is auto-set in the database.

**Why enforce email verification?**

- Prevents spam or fake account creation.  
- Ensures communications (password resets, notifications) reach valid users.  
- Complies with security best practices and legal requirements (GDPR, etc.).

---

### 3. Preventing Multiple Accounts with the Same Email Across Providers

- Many users have accounts with multiple OAuth providers and may also register with credentials (email/password).  
- To **avoid duplicate users with the same email**, this system prevents multiple accounts from being created for the same email, regardless of provider.  
- If a user tries to log in with credentials but their email is linked only to an OAuth provider, the system informs them to log in using that OAuth provider instead.

**Benefits:**

- Unified user identity in the database.  
- Easier user management and support.  
- Prevents confusion and potential security risks from fragmented user profiles.

---

## How This Is Implemented

### OAuth Providers (Google, GitHub)

#### Google OAuth Setup

##### Google Cloud Console

1. Create a new project or select an existing one.
2. Enable **Google+ API** for the project.
3. Navigate to **Credentials** and create new **OAuth 2.0 Client IDs**.
4. Add authorized redirect URIs for your application:

   - Development:  
     `http://localhost:3000/api/auth/callback/google`
   - Production:  
     `https://yourdomain.com/api/auth/callback/google`

---

#### GitHub OAuth Setup

##### GitHub Developer Settings

1. Go to **Settings > Developer settings > OAuth Apps**.
2. Click **New OAuth App**.
3. Fill in the app details:
   - Application name
   - Homepage URL
   - Authorization callback URL (redirect URI)
4. Register the app.

**Authorized Redirect URI example:**  
`https://yourdomain.com/api/auth/callback/github`

---

### Credentials Provider

- Uses a custom `authorize` function that:  
  - Validates email and password input using a Zod schema.  
  - Checks if the user exists in the database.  
  - Verifies that the user has a password set (not OAuth-only).  
  - Enforces that `emailVerified` is set before allowing login.  
  - Uses bcrypt to verify the password hash.

- Errors are thrown with clear messages (invalid input, unverified email, linked OAuth account, incorrect password).

### Email Verification Workflow

- For credentials, users are required to verify email during or after registration before login is permitted.  
- For OAuth, `emailVerified` is set automatically on first user creation, trusting the provider's verification.

### User Linking and Multi-login Prevention

- The database schema uses unique constraints on email and accounts, preventing multiple user records for the same email.  
- The system detects if an email is linked to OAuth accounts only and prevents credential login to avoid multi-account confusion.  
- The `linkAccount` event handles explicit linking of additional OAuth providers for the same user (multi-login support), but is not used to create duplicate users.

---

## Summary of Key Design Decisions

| Aspect               | Decision & Rationale                                                  |
|----------------------|----------------------------------------------------------------------|
| **OAuth Providers**  | Google and GitHub for convenient, secure social login                |
| **Credentials**      | Classic email/password login for flexibility                         |
| **Email Verification** | Enforced for credentials, auto-set for OAuth via createUser event   |
| **Multi-login Prevention** | Prevent creating multiple users with the same email across providers |
| **Error Handling**   | Explicit, user-friendly error messages in credential login flow       |
| **Session Strategy** | JWT-based sessions for stateless, scalable auth                      |

---

## Future Considerations

- Implement email verification workflow UI (send verification emails, confirm links).  
- Enhance account linking UI to let users add/remove OAuth providers.  
- Support for password resets and multi-factor authentication (MFA).  
- Rate limiting and brute-force protection on login attempts.

---
