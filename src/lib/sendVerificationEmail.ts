import { Resend } from "resend";
import VerificationEmail from "../../emails/VerificationEmail"
import { ApiResponse } from "@/types/ApiResponse"

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    const resend = new Resend(process.env.RESEND_API_KEY);
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'EchoBox Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        return { success: true, message: "Verification email sent" }

    } catch (error) {
        console.error("Error sending verification email:", error)
        return { success: false, message: "Error sending verification email" }

    }
}