/**
 * An array of routes that are accessible to public
 * These routes do not need authentication
 * @type {string[]}
 */
export const publicRoutes = [
    "/",
    "/auth/new-verification"
]

/**
 * Authentications routes are used for login,register etc
 * when a user already authenticated they should redirected away from these.
 * @type {string[]}
 */

export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/error"
]

/**
 * A prefix for API authentication routes.
 * NextAuth uses this to handle requests like `/api/auth/*`
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth"

/**
 * Default redirect path after logged in
 * @type {string}
 */

export const default_login_redirect="/settings"