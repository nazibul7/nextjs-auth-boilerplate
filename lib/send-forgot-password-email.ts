import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendForgotPasswordEmail = async (email: string, token: string) => {
    try {
        const resetLink = `http://localhost:3000/auth/reset-password?token=${token}`;
        const { data, error } = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Reset your password",
            html: `
              <p>Hi,</p>
              <p>You requested to reset your password. Click the link below to continue:</p>
              <a href="${resetLink}" style="color:#2563eb; font-weight:bold;">Reset Password</a>
              <p>This link will expire in 5 minutes. If you didn’t request a reset, you can safely ignore this email.</p>
            `
        })

        if (error) {
            console.error("Password reset email error:", error);
            return { error: "Failed to send reset email" };
        }
        return { success: true, data };
    } catch (error) {
        console.error("Password reset email exception:", error);
        return { error: "Unexpected error while sending reset email" };
    }
}