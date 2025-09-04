import EmailVerificationForm from '@/components/auth/email-verification-form'

export default function EmailVerificationPage({ searchParams }: { searchParams:Promise <{ token: string }> }) {

    return (
        <EmailVerificationForm searchParams={searchParams} />
    )
}
