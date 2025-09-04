import { db } from "@/lib/db";
import { TokenType } from "@prisma/client";

export const getVerificationTokenByEmail = async (email: string, type: TokenType) => {
    try {
        const tokens = await db.verificationToken.findFirst({
            where: { email, type }
        })
        return tokens;
    } catch (error) {
        return null;
    }
}
export const getVerificationTokenByToken = async (token: string) => {
    try {
        const tokens = await db.verificationToken.findUnique({
            where: { token }
        })
        return tokens;
    } catch (error) {
        return null;
    }
}