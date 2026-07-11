import type { Metadata } from "next";
import { LegalSection, LegalShell } from "@/components/legal/legal-shell";
import { SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "How refunds work for CancelKit subscriptions.",
};

export default function RefundPolicyPage() {
  return (
    <LegalShell title="Refund Policy" effectiveDate="July 11, 2026">
      <LegalSection heading="14-day free trial">
        <p>
          Every CancelKit account starts with a 14-day free trial and no
          payment method is required to begin it. You will not be charged
          anything until you actively upgrade to a paid subscription from the
          dashboard, so there is nothing to refund during the trial — you can
          simply stop using the service.
        </p>
      </LegalSection>

      <LegalSection heading="After you've been charged">
        <p>
          If you upgrade and change your mind, email us at{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="underline underline-offset-2">
            {SUPPORT_EMAIL}
          </a>{" "}
          within 7 days of the charge and we&apos;ll issue a full refund, no
          questions asked. After 7 days, we don&apos;t offer prorated refunds
          for partial billing periods, but you can cancel anytime from the
          dashboard to stop future charges — you&apos;ll keep access until
          the end of the period you already paid for.
        </p>
      </LegalSection>

      <LegalSection heading="Billing errors">
        <p>
          Duplicate charges or other billing mistakes are always corrected in
          full, regardless of how much time has passed — just email us and
          we&apos;ll sort it out.
        </p>
      </LegalSection>

      <LegalSection heading="How refunds are processed">
        <p>
          Subscription payments are processed by{" "}
          <strong>Lemon Squeezy</strong>, our Merchant of Record, so approved
          refunds are issued by Lemon Squeezy back to your original payment
          method. Refunds typically appear within 5–10 business days,
          depending on your bank or card issuer.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
