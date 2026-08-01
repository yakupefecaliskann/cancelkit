import type { Metadata } from "next";
import { LegalSection, LegalShell } from "@/components/legal/legal-shell";
import { SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of CancelKit.",
};

export default function TermsOfServicePage() {
  return (
    <LegalShell title="Terms of Service" effectiveDate="August 1, 2026">
      <p>
        These terms govern your use of CancelKit, a hosted service that lets
        you add an exit survey and a Stripe-powered save offer to your
        cancellation flow. By creating an account, you agree to these terms.
        CancelKit is operated as an individual sole proprietorship based in
        Turkey.
      </p>

      <LegalSection heading="1. The service">
        <p>
          CancelKit provides a dashboard to configure exit-survey reasons and
          save offers, and an embeddable widget that presents them to your
          customers when they click your cancel button. Discount and pause
          actions are applied to your subscriptions through the Stripe
          restricted API key you connect — CancelKit never processes card
          payments directly.
        </p>
      </LegalSection>

      <LegalSection heading="2. Accounts">
        <p>
          You must provide accurate information when creating an account and
          are responsible for maintaining the security of your login and
          your connected Stripe restricted key. You must be legally able to
          enter into a contract and be operating a genuine business to use
          CancelKit.
        </p>
      </LegalSection>

      <LegalSection heading="3. The service is free">
        <p>
          CancelKit is free to use. There is no paid plan, no trial period
          that expires, and no payment method is required to create or keep
          an account. We do not process payments from you and we do not hold
          any billing information about you beyond your account email.
        </p>
        <p className="mt-2">
          We may introduce paid plans in the future. If we do, we will give
          you notice by email first, and your account will never be charged
          unless you explicitly sign up for a paid plan.
        </p>
      </LegalSection>

      <LegalSection heading="4. Your Stripe account and connected key">
        <p>
          You are responsible for the Stripe restricted API key you provide
          and for scoping it appropriately. CancelKit only performs the
          discount and pause actions you explicitly configure as save offers
          — it does not read, export, or act on any other data in your
          Stripe account. Your use of Stripe remains subject to Stripe&apos;s
          own terms of service.
        </p>
      </LegalSection>

      <LegalSection heading="5. Acceptable use">
        <p>You agree not to:</p>
        <ul className="flex flex-col gap-2 pl-5 [&>li]:list-disc">
          <li>Use CancelKit for any unlawful purpose.</li>
          <li>
            Attempt to reverse-engineer, decompile, or circumvent the
            widget&apos;s security or rate limits.
          </li>
          <li>
            Use the service to collect data about end customers beyond what
            the exit survey and save-offer flow requires.
          </li>
          <li>
            Resell or white-label CancelKit as your own product without our
            written permission.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="6. Availability and disclaimer of warranties">
        <p>
          CancelKit is provided &quot;as is&quot; and &quot;as
          available,&quot; without warranties of any kind, express or
          implied. We make reasonable efforts to keep the service available
          and reliable but do not guarantee uninterrupted or error-free
          operation.
        </p>
      </LegalSection>

      <LegalSection heading="7. Limitation of liability">
        <p>
          To the maximum extent permitted by law, CancelKit&apos;s total
          liability arising out of or related to these terms or the service
          will not exceed one hundred US dollars (US$100), and we will not be
          liable for any indirect, incidental, or consequential damages,
          including lost revenue or lost profits. CancelKit is provided to
          you free of charge.
        </p>
      </LegalSection>

      <LegalSection heading="8. Termination">
        <p>
          You may stop using CancelKit and delete your account at any time
          from the dashboard. We may suspend or terminate accounts that
          violate these terms, including abusive use of the API or widget.
        </p>
      </LegalSection>

      <LegalSection heading="9. Intellectual property">
        <p>
          CancelKit retains all rights to the CancelKit software, dashboard,
          and widget. You retain all rights to your own project data and to
          the data collected through your use of the widget.
        </p>
      </LegalSection>

      <LegalSection heading="10. Changes to these terms">
        <p>
          We may update these terms from time to time. Material changes will
          be reflected by an updated effective date above, and where
          appropriate, we&apos;ll notify you by email.
        </p>
      </LegalSection>

      <LegalSection heading="11. Governing law">
        <p>
          These terms are governed by the laws of the Republic of Turkey,
          without regard to conflict-of-law principles, except where
          mandatory consumer-protection laws in your own jurisdiction apply
          regardless of that choice.
        </p>
      </LegalSection>

      <LegalSection heading="12. Contact">
        <p>
          Questions about these terms? Email{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="underline underline-offset-2">
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      </LegalSection>
    </LegalShell>
  );
}
