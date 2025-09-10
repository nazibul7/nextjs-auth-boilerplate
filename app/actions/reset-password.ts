"use server"

import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token"
import { sendVerificationEmail } from "@/lib/send-verification-email";
import { generateVerificationToken } from "@/lib/token";
import { TokenType } from "@prisma/client";
import { ResetPasswordSchema } from "../schemas";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const resetPassword = async (password: string, confirmPassword: string, token: string) => {
    try {
        /**Validate fields */
        const validateFields = ResetPasswordSchema.safeParse({ password, confirmPassword })
        if (!validateFields.success) {
            return { error: validateFields.error.errors[0].message }
        }
        const { password: validatedPassword } = validateFields.data;

        /** Get the verification token from database */
        const existingToken = await getVerificationTokenByToken(token);

        if (!existingToken) {
            return { error: "Token does not exist!" };
        }
        console.log(existingToken.type);

        if (existingToken.type != TokenType.PASSWORD_RESET) {
            return { error: "Invalid token type!" }
        }

        const hasExpired = new Date(existingToken.expires) < new Date();

        if (hasExpired) {
            return { error: "Token has expired" };
        }

        /** Get user by email */
        const existingUser = await getUserByEmail(existingToken.email);
        if (!existingUser || !existingUser.email) {
            return { error: "User not found" };
        }

        /**Send verification email if user email is not verified*/
        if (!existingUser.emailVerified) {
            const emailVerificationToken = await generateVerificationToken(existingUser.email, TokenType.EMAIL_VERIFICATION);
            if (!emailVerificationToken) {
                return { error: "Could not generate verification token for Email verification" };
            }
            await sendVerificationEmail(emailVerificationToken.email, emailVerificationToken.token);
            return {
                success: "You need to verify your email before resetting your password. We've sent you a new verification link.",
            };
        }

        /**Hash new password */
        const hashedPassword = await bcrypt.hash(validatedPassword, 10);

        /**Update user password */
        await db.user.update({
            where: { id: existingUser.id },
            data: {
                password: hashedPassword
            }
        })

        /**Delete token after use */
        await db.verificationToken.delete({
            where: { id: existingToken.id }
        })

        return { success: "Password has been reset successfully" }
    } catch (error) {
        console.error("ResetPassword error:", error);
        return { error: "Something went wrong" };
    }
}