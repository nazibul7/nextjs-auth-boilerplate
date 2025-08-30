import NewVerificationForm from '@/components/auth/new-verification-form'

export default function NewVerificationPage({ searchParams }: { searchParams:Promise <{ token: string }> }) {

    return (
        <NewVerificationForm searchParams={searchParams} />
    )
}
