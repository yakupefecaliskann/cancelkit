import type { Metadata } from "next";
import { LegalSection, LegalShell } from "@/components/legal/legal-shell";
import { SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "CancelKit is free to use, so there are no charges and nothing to refund.",
};

export default function RefundPolicyPage() {
  return (
    <LegalShell title="Refund Policy" effectiveDate="August 1, 2026">
      <LegalSection heading="CancelKit is free">
        <p>
          CancelKit does not charge for the service. There is no paid plan, no
          trial that turns into a subscription, and no payment method is
          required to create or keep an account — so there is nothing to
          refund. You can stop using CancelKit or delete your account at any
          time from the dashboard.
        </p>
      </LegalSection>

      <LegalSection heading="If you see a charge from us">
        <p>
          We have no way to bill you and we do not store any payment details,
          so a charge described as coming from CancelKit did not originate
          from us. Email us at{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="underline underline-offset-2">
            {SUPPORT_EMAIL}
          </a>{" "}
          and we&apos;ll help you identify where it actually came from.
        </p>
      </LegalSection>

      <LegalSection heading="If we introduce paid plans later">
        <p>
          If CancelKit ever adds a paid plan, we will publish the refund terms
          on this page before taking any payments, and no existing account
          will be charged without explicitly signing up for a paid plan first.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
