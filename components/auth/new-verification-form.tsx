
import { redirect } from 'next/navigation';
import CardWrapper from '@/components/auth/card-wrapper';
import { newVerification } from '@/app/actions/new-verification';
import FormError from '@/components/form-error';

export default async function NewVerificationPage({
    searchParams
}: {
    searchParams: Promise<{ token?: string }>
}) {
    const { token } = await searchParams;

    /** Handle missing token */
    if (!token) {
        return (
            <CardWrapper
                headerLabel='Verification Failed'
                backButtonLabel='Go to login page'
                backButtonHref='/auth/login'
            >
                <div className='w-full flex items-center justify-center'>
                    <FormError message="Missing verification token" />
                </div>
            </CardWrapper>
        );
    }

    /** Verify the token */
    const result = await newVerification(token);

    /** Redirect on success */
    if (result.success) {
        redirect('/settings');
    }

    /** Show error state */
    return (
        <CardWrapper
            headerLabel='Verification Failed'
            backButtonLabel='Go to login page'
            backButtonHref='/auth/login'
        >
            <div className='w-full flex items-center justify-center'>
                <FormError message={result.error} />
            </div>
        </CardWrapper>
    );
}