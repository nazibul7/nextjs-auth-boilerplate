import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import authConfig from "@/auth.config"
import { UserRole } from "@prisma/client"
import { getUserById } from "@/data/user"

/**
 * AuthOptions config defines how NextAuth handles authentication, session, JWT, and custom pages.
 * Without this config, NextAuth wouldn’t know what providers to use,
 * what data to include in the session, or where to send users during login/logout.
 * 
 * Since I am using server actions, 
 * custom form,
 * manually handling redirects and errors
 * that's omit pages entirely from config
 */

export const { auth, handlers, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
    callbacks: {
        /**
         * signIn callback:
         * - Runs **only** at sign-in.
         * - Allows you to control if a user can sign in.
         * - Return `true` to allow sign-in.
         * - Return `false` or throw an error to deny sign-in.
         *
         * Use cases:
         * - Enforce email verification.
         * - Restrict sign-ins based on user role, status, or provider.
         * - Auto-verify OAuth emails.
         */
        async signIn({ user, account, profile }) {
            /**
             * Didn't Use Upsert here. Because,
             * 
             * For very first user with OAuth signin when it call db.user.update it showing below error. 
             * Invalid `prisma.user.update()` invocation:
             * An operation failed because it depends on one or more records that were required but not found.
             * No record was found for an update.
             * 
             * upsert == update or insert
             * 
             * But with upsert also Having prisma adapter it is creating **two user** in DB with here to use email:user.email??undefined**
             * or will show error **Eamil is already in use with different provider!**
             * So the best thing is use **event.createUser** callabck only 
             */
            // await db.user.upsert({
            //     where: { email: user.email },
            //     create: {
            //         name: user.name ?? undefined,
            //         email:user.email??undefined
            //     },
            //     update: {
            //         emailVerified: new Date()
            //     }
            // });

            /**
             * Allow OAuth without email verification
             * Have put emailverified logic Use the events.createUser callback to update emailVerified after user creation.
             * For credentials login, email verification is setup in authorize()
             */
            // For OAuth providers, email is already verified by the provider

            if (account?.provider !== "credentials") return true;
            const existingUser = await getUserById(user.id as string);
            if (!existingUser?.emailVerified) return false;
            return true;
        },



        /**
         * jwt callback:
         * Runs every time a JWT is created/updated/read.
         * - When the user first signs in, `user` is defined.
         * - On future requests, `user` is undefined — only the `token` is reused.
         * - Fields you attach here stay in the JWT cookie until signout/expiration.
         * - Here only need to define jwt() if you want to store custom data in the token
         * - If I only care about email, name, etc., I can skip it.
         * - But since you want to access token.id, token.role, etc., you need define like below.
         */
        async jwt({ token, user }) {
            // Runs on initial signin only
            if (user) {
                // First sign-in: attach custom data
                token.id = user.id;
                token.role = user.role;
            }
            // On every request: token already has id/email/role, so you reuse it.
            return token
        },

        /**
         * session callback:
         * Shapes what `useSession` & `getSession` return to your frontend.
         * - Runs on every request that needs session.
         * - Pulls custom fields from JWT & attaches them to `session.user`.
         * - If you forget to copy, session.user will be empty!
        */
        async session({ session, token }) {
            // console.trace("Show me");  Who is calling?
            session.user.id = token.id as string;
            session.user.email = token.email as string;
            session.user.role = token.role as UserRole
            return session;
        },
    },
    /**
     * NextAuth `events.createUser`:
     * Runs ONLY when NextAuth itself creates a new user in the database
     * 
     * via the configured Adapter (adapter.createUser()).
     * 
     * Common cases:
     *   - ✅ First-time OAuth login (Google, GitHub, etc.) when no existing user
     *   - ✅ First-time Email provider login when no existing user
     * 
     * Will NOT run when:
     *   - ❌ Logging in with credentials after you manually registered the user
     *   - ❌ User already exists in the database for the given email/provider
     * 
     * If you need "first login" logic for credentials-based accounts,
     * handle it inside your custom registration flow or credentials `authorize` callback.
     * 
     * createUser → run once on initial user creation (credentials or OAuth)
     * Because createUser runs at the moment the user account is first created, before the sign-in attempt completes.
     * The user exists in the DB already, but your signIn callback can still block them from logging in 
     * until they verify their email.
     * Blocking sign-in does not remove or prevent user creation, 
     * it just prevents that user from authenticating until conditions are met (email verified).
     */
    events: {
        async createUser({ user }) {
            // Set emailVerified as soon as the user is created (for OAuth)
            if (user.email && !user.emailVerified) {
                await db.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        emailVerified: new Date()
                    }
                })
            }
        },

        //----------- linkAccount(message) {}---------
        /**
         * NextAuth `linkAccount` Event
         *
         * Fires after an OAuth account (Google, GitHub, etc.) is linked to a user
         * in the database.
         *
         * Scenarios where it runs:
         * 1. User logs in with an OAuth provider for the first time,
         *    and NextAuth finds an existing user with the same email (or matches via custom linking rules).
         * 2. A signed-in user explicitly connects an additional provider to their account
         *    (multi-login support).
         *
         * ⚠️ Not ideal for first-login/email verification:
         * - If the user is brand new via OAuth, `createUser` runs first.
         * - `linkAccount` will run every time an OAuth account is linked, not only on first login.
         * - Setting `emailVerified` here works only if the link happens immediately after account creation,
         *   which is common for first OAuth logins but not guaranteed.
         */

    },
    pages: {
        /**
         * Custom pages:
         * - Override default NextAuth pages for signIn and error.
         * - Useful when using custom forms and handling UI myself.
         */
        signIn: '/auth/login', // Custom login page
        error: '/auth/error',  // Redirect here on auth errors (e.g., OAuth or callback issues)
    },
})  