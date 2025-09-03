"use server"

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
    const verificationLink = `http://localhost:3000/auth/email-verification?token=${token}`;
    try {
        const { data, error } = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Verify your email",
            html: `
                <p>Hi,</p>
                <p>Please verify your email by clicking the link below:</p>
                <a href="${verificationLink}" style="color:#2563eb; font-weight:bold;">Verify Email</a>
                <p>This link will expire in 1 hour.</p>
            `
        });

        if (error) {
            console.error("Email send error:", error);
            return { error: "Failed to send verification email" };
        }
        return { success: true, data };
    } catch (error) {
        console.error("Email send exception:", error);
        return { error: "Unexpected error while sending email" };
    }
}