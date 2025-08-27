"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { generateVerificationToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";

export default function ResendVerificationButton({
  email,
  onSuccess,
  onError
}:
  {
    email: string,
    onSuccess: (msg: string | undefined) => void,
    onError: (msg: string | undefined) => void
  }) {
  const [isPending, startTransition] = useTransition();

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
              const token = await generateVerificationToken(email);

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
