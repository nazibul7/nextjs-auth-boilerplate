"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { generateVerificationToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/send-verification-email";
import { TokenType } from "@prisma/client";

export default function ResendVerificationButton({
  email,
  onSuccess,
  onError,
  type
}:
  {
    email: string,
    onSuccess: (msg: string | undefined) => void,
    onError: (msg: string | undefined) => void
    type: TokenType
  }) {
  const [isPending, startTransition] = useTransition();

  {/* - Use <Button> directly (like you have now) when the action is something that performs an operation
        in-place (resend verification, submit form, trigger async function).
  
      - Use <Link> (from next/link) when the action is navigational (redirects user to another route/page). */}
  return (
    <>
      <Button
        variant="link"
        type="button"
        disabled={isPending}
        onClick={() => {
          onError(undefined);
          onSuccess(undefined);
          startTransition(async () => {
            try {
              const token = await generateVerificationToken(email, type);

              if (!token) {
                onError("Could not generate verification token");
                return;
              }

              const result = await sendVerificationEmail(token.email, token.token);

              if (result.error) onError(result.error);
              if (result.success) onSuccess("Verification email sent again! Please check your inbox.");
            } catch {
              onError("Unexpected error while resending verification email");
            }
          })
        }
        }
      >
        {isPending ? 'Sending...' : 'Resend'}
      </Button>
    </>
  );
}
