import { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { LoginSchema } from "@/app/schemas";
import { getUserByEmail } from "@/data/user";
import bcrypt from "bcryptjs"

export default {
    trustHost: true,
    // Defines how users sign in
    providers:
        [CredentialsProvider({
            async authorize(credentials, request) {

                // validate input with zod schema
                const validateField = LoginSchema.safeParse(credentials);
                if (!validateField.success) {
                    throw new Error("Invalid login details. Please check your email and password.");
                }

                const { email, password } = validateField.data;

                // fetch user from db
                const user = await getUserByEmail(email);

                // user not found || user exist but no password via OAuth & has no password
                if (!user) return null;

                if (!user.password) {
                    const provider = user.accounts.map(acc => acc?.provider).join(", ");
                    throw new Error(`This email is linked to ${provider}. Please log in using ${provider}.`);
                }
                // Check email is verified
                if (!user.emailVerified) {
                    throw new Error("Please verify your email address before logging in.");
                };

                // password verification
                const passwordMatch = await bcrypt.compare(password, user.password);
                if (!passwordMatch) {
                    throw new Error("Incorrect password. Please try again.");
                };

                return user;
            }
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        })
        ]
} satisfies NextAuthConfig

