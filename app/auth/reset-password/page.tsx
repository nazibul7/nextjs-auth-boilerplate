import { ResetPasswordForm } from '@/components/auth/reset-password-form'

export default function ResetPassword({ searchParams }: { searchParams: { token: string } }) {
    const token = searchParams.token;
    return (
        <ResetPasswordForm token={token} />
    )
}
