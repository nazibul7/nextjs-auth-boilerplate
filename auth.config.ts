import { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { LoginSchema } from "./app/schemas";
import { getUserByEmail } from "./data/user";
import bcrypt from "bcryptjs"

export default {
    trustHost: true,
    // Defines how users sign in
    providers:
        [CredentialsProvider({
            async authorize(credentials, request) {

                // validate input
                const validateField = LoginSchema.safeParse(credentials);
                if (validateField.success) {
                    const { email, password } = validateField.data;

                    // fetch user from db
                    const user = await getUserByEmail(email);

                    // user not found || user exist but no password via OAuth & has no password
                    if (!user) return null;

                    if (!user.password) {
                        const provider = user.accounts.map(acc => acc.provider).join(", ");
                        throw new Error(`This email is linked to ${provider}. Use that to log in.`);
                    }

                    // Check email is verified
                    if (!user.emailVerified) return null;

                    // password verification
                    const passwordMatch = await bcrypt.compare(password, user.password);
                    if (!passwordMatch) return null;

                    return user;
                }
                return null;
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

console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
