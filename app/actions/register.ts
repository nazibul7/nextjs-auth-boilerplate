"use server"

import { RegisterSchema, RegisterFormDataType } from "@/app/schemas"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { getUserByEmail } from "@/data/user"
import { generateVerificationToken } from "@/lib/token"
import { sendVerificationEmail } from "@/lib/mail"


export const register = async (data: RegisterFormDataType) => {
    try {
        //Validate fields with Zod
        const validateFields = RegisterSchema.safeParse(data)
        if (!validateFields.success) {
            return { error: "Invalid fields!" };
        }

        const { name, email, password } = validateFields.data

        // Check if user already exists
        const existingUser = await getUserByEmail(email);
        if (existingUser) {

            const provider = existingUser.accounts.map(acc => acc?.provider).join(", ");

            /** For credentilas users who doesn't have providers */
            if (provider.length === 0 || provider.includes("credentials")) {
                return { error: "This email is already registered. Please log in with your password." };
            }
            /**For Oauth users */
            return { error: `This email is linked to ${provider}. Please log in using ${provider}` }
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create user
        await db.user.create({
            data: {
                name,
                email,
                password: hashPassword
            }
        })

        // Generate verification token
        const verificationToken = await generateVerificationToken(email);
        if (!verificationToken) {
            return {
                error: "Could not generate verification token"
            }
        }

        // Send verification email
        const emailResult = await sendVerificationEmail(
            verificationToken?.email as string,
            verificationToken?.token as string
        );

        if (emailResult.error) {
            return { error: emailResult.error };
        }
        return { success: "Confirmation email sent! Please check your inbox." };
    } catch (error) {
        console.error("Registration error:", error);
        return { error: "Something went wrong. Please try again later." };
    }
}