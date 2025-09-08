"use server"

import { sendForgotPasswordEmail } from "@/lib/send-forgot-password-email";
import { generateVerificationToken } from "@/lib/token"
import { TokenType } from "@prisma/client"


export const requestForgotPassword = async (email: string) => {
    try {
        /**Generate verification token */
        const token = await generateVerificationToken(email, TokenType.EMAIL_VERIFICATION);
        if (!token) {
            return { error: "Could not generate verification token" };
        }

        /**Send verification email */
        const tokenSendToEmail = await sendForgotPasswordEmail(token.email, token.token);
        if (tokenSendToEmail.error) {
            return { error: tokenSendToEmail.error };
        }

        return { success: "Password reset link sent to your email." };
    } catch (error) {
        console.log("Request password reset error", error);
        return { error: "Something went wrong. Please try again later." }
    }
}