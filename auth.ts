import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "./lib/db"
import authConfig from "./auth.config"
import { UserRole } from "@prisma/client"

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
        async signIn({ user, account }) {
            // For OAuth providers, email is already verified by the provider
            if (account?.provider != "credentials") {
                if (user.email && !user.emailVerified) {
                    await db.user.update({
                        where: { email: user.email },
                        data: { emailVerified: new Date() }
                    });
                }
                return true;
            }
            // For credentials login, email verification is setup in     authorize()
            return true;
        },

        /**
         * jwt callback:
         * Runs every time a JWT is created/updated/read.
         * - When the user first signs in, `user` is defined.
         * - On future requests, `user` is undefined — only the `token` is reused.
         * - Fields you attach here stay in the JWT cookie until signout/expiration.
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