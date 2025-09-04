
import CardWrapper from '@/components/auth/card-wrapper';
import { emailVerification } from '@/app/actions/email-verification';
import FormError from '@/components/form-error';
import { TokenType } from '@prisma/client';
import FormSuccess from '../form-success';

export default async function EmailVerificationForm({
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
    const result = await emailVerification(token, TokenType.EMAIL_VERIFICATION);

    console.log(result.success);

    /** Redirect on success */
    if (result.success) {
        return (
            <CardWrapper
                headerLabel='Verification Successfull'
                backButtonLabel='Go to login page'
                backButtonHref='/auth/login'
            >
                <div className='w-full flex items-center justify-center'>
                    <FormSuccess message={result.success} />
                </div>
            </CardWrapper>
        )
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