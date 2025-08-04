/**
 * NEXTAUTH.JS ROUTE HANDLERS - COMPLETE A-Z GUIDE
 * =================================================
 * 
 * This file exports HTTP handlers for NextAuth.js authentication routes.
 * Place this in: app/api/auth/[...nextauth]/route.js (App Router)
 */

import { handlers } from "@/auth";

/**
 * WHAT ARE HANDLERS?
 * ------------------
 * - Pre-built HTTP request handlers for authentication endpoints
 * - Handle GET and POST requests to /api/auth/* routes
 * - Automatically created by NextAuth.js from your auth config
 */

/**
 * THE HANDLERS OBJECT CONTAINS:
 * -----------------------------
 * handlers.GET  - Handles all GET requests to auth endpoints
 * handlers.POST - Handles all POST requests to auth endpoints
 * 
 * WHAT THEY HANDLE:
 * GET requests:
 *   - /api/auth/signin (show sign-in page)
 *   - /api/auth/signout (show sign-out confirmation)
 *   - /api/auth/session (get current session data)
 *   - /api/auth/providers (list available providers)
 *   - /api/auth/csrf (get CSRF token)
 *   - /api/auth/callback/[provider] (OAuth callback handling)
 * 
 * POST requests:
 *   - /api/auth/signin/[provider] (submit sign-in form)
 *   - /api/auth/signout (confirm sign-out)
 *   - /api/auth/session (session token refresh)
 *   - /api/auth/callback/[provider] (OAuth token exchange)
 */

// Export the handlers as named exports for App Router
export const { GET, POST } = handlers;

/**
 * WHY THIS DESTRUCTURING SYNTAX?
 * ------------------------------
 * Next.js App Router expects named exports for HTTP methods:
 * 
 * ❌ Wrong (Pages Router style):
 * export default function handler(req, res) { ... }
 * 
 * ✅ Correct (App Router style):
 * export async function GET(request) { ... }
 * export async function POST(request) { ... }
 * 
 * The destructuring `{ GET, POST } = handlers` gives us both functions.
 */

/**
 * WHAT HAPPENS UNDER THE HOOD:
 * ----------------------------
 * 1. NextAuth creates these handlers from your auth config
 * 2. Each handler is an async function: (request: Request) => Response
 * 3. They parse the URL to determine which auth action to perform
 * 4. They call your configured providers, callbacks, etc.
 * 5. They return appropriate HTTP responses (JSON, redirects, HTML)
 */

/**
 * EXAMPLE REQUEST FLOWS:
 * ---------------------
 * 
 * 1. Sign-in with Google:
 *    GET /api/auth/signin → Shows sign-in page
 *    POST /api/auth/signin/google → Redirects to Google OAuth
 *    GET /api/auth/callback/google?code=... → Handles OAuth callback
 * 
 * 2. Get current session:
 *    GET /api/auth/session → Returns JSON with user data or null
 * 
 * 3. Sign out:
 *    GET /api/auth/signout → Shows confirmation page
 *    POST /api/auth/signout → Clears session, redirects to home
 */

/**
 * FILE STRUCTURE REQUIREMENTS:
 * ----------------------------
 * This file MUST be at: app/api/auth/[...nextauth]/route.js
 * 
 * The [...nextauth] is a "catch-all" dynamic route that captures:
 * - /api/auth/signin
 * - /api/auth/signout  
 * - /api/auth/session
 * - /api/auth/providers
 * - /api/auth/callback/google
 * - /api/auth/callback/github
 * - etc.
 */

/**
 * CUSTOMIZATION OPTIONS:
 * ---------------------
 * If you need custom behavior, you can wrap the handlers:
 * 
 * import { handlers } from "@/auth";
 * 
 * export async function GET(request) {
 *   console.log("Auth GET request:", request.url);
 *   return handlers.GET(request);
 * }
 * 
 * export async function POST(request) {
 *   console.log("Auth POST request:", request.url);
 *   return handlers.POST(request);
 * }
 */

/**
 * DEBUGGING TIPS:
 * --------------
 * 1. Check Network tab in DevTools for auth requests
 * 2. Add NEXTAUTH_DEBUG=true to see detailed logs
 * 3. Verify this file is in the correct location
 * 4. Ensure your auth config is properly exported
 * 
 * Common errors:
 * - File in wrong location → 404 on auth routes
 * - Wrong export syntax → Handler not found
 * - Missing auth config → Runtime errors
 */

/**
 * RELATED FILES:
 * -------------
 * - @/auth - Your NextAuth configuration (providers, callbacks, etc.)
 * - middleware.js - Route protection (optional)
 * - Your sign-in components - Use signIn(), signOut() from "next-auth/react"
 */