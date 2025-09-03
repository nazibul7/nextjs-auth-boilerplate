"use server"

import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token"
import { db } from "@/lib/db";
import { TokenType } from "@prisma/client";

export const emailVerification = async (token: string,type:TokenType) => {
    try {
        /** Get the verification token from database */
        const existingToken = await getVerificationTokenByToken(token);
        if (!existingToken) {
            return { error: "Token does not exist!" };
        }

        if(existingToken.type!=type){
            console.log("TRUE\n");
            
            return {error:"Invalid token type!"}
        }
        /** Check if token has expired */
        const hasExpired = new Date(existingToken.expires) < new Date();

        if (hasExpired) {
            return { error: "Token has expired" };
        }

        /** Get user by email */
        const existingUser = await getUserByEmail(existingToken.email);
        if (!existingUser) {
            return { error: "User not found" };
        }

        if (existingUser.emailVerified) {
            return { error: "Email is already verified" };
        }

        /** Update in DB */
        await db.user.update({
            where: { id: existingUser.id },
            data: { emailVerified: new Date() }
        })

        /** Delete the used token */
        await db.verificationToken.delete({
            where: { id: existingToken.id }
        })

        return { success: "Email verified successfully!" };
    } catch (error) {
        console.error("Email verification error:", error);
        return { error: "Something went wrong during verification" };
    }
}
