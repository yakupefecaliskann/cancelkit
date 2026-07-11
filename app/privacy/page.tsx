import type { Metadata } from "next";
import { LegalSection, LegalShell } from "@/components/legal/legal-shell";
import { SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How CancelKit collects, uses, and protects your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalShell title="Privacy Policy" effectiveDate="July 11, 2026">
      <p>
        CancelKit (&quot;CancelKit&quot;, &quot;we&quot;, &quot;us&quot;) is
        operated as an individual sole proprietorship based in Turkey. This
        policy explains what data we collect through cancelkit.site and the
        CancelKit dashboard and embeddable widget, and how we use it.
      </p>

      <LegalSection heading="1. Data we collect">
        <p>From you, as a CancelKit customer:</p>
        <ul className="flex flex-col gap-2 pl-5 [&>li]:list-disc">
          <li>Your account email address (used for login and billing).</li>
          <li>
            Your Stripe restricted API key, encrypted at rest with
            AES-256-GCM before it ever reaches our database. We never see or
            store your Stripe full-access secret key.
          </li>
          <li>
            Project configuration you create: allowed origins, save-offer
            settings, and exit-survey reasons.
          </li>
        </ul>
        <p className="mt-2">
          From your end customers, via the CancelKit widget on your site:
        </p>
        <ul className="flex flex-col gap-2 pl-5 [&>li]:list-disc">
          <li>
            The cancellation session: chosen exit-survey reason, whether a
            save offer was shown and accepted, and the resulting recovered
            revenue amount.
          </li>
          <li>
            The Stripe customer identifier you pass to the widget (and their
            email, if you choose to pass it) — this is the same identifier
            already present in your own Stripe account.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="2. How we use this data">
        <p>
          We use this data solely to operate the service: rendering the exit
          survey and save offer, applying the discount or pause you configure
          through your connected Stripe account, and showing you the
          resulting recovered-revenue dashboard. We do not use your data for
          advertising, and we do not sell it to anyone.
        </p>
      </LegalSection>

      <LegalSection heading="3. Third parties we share data with">
        <p>
          CancelKit is built on top of a small number of infrastructure
          providers, each of which processes data only as needed to run the
          service:
        </p>
        <ul className="flex flex-col gap-2 pl-5 [&>li]:list-disc">
          <li>
            <strong>Supabase</strong> — hosts our database and handles
            authentication.
          </li>
          <li>
            <strong>Vercel</strong> — hosts the application and widget.
          </li>
          <li>
            <strong>Lemon Squeezy</strong> — processes your subscription
            payment as our merchant of record (see our{" "}
            <a href="/terms" className="underline underline-offset-2">
              Terms of Service
            </a>
            ).
          </li>
          <li>
            <strong>Resend</strong> — delivers transactional emails (login
            links, account notifications).
          </li>
          <li>
            <strong>Stripe</strong> — your own Stripe account, which you
            connect directly. CancelKit never routes your customers&apos;
            payment data through our servers; discount and pause actions are
            applied via the Stripe API using your restricted key.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="4. Data retention">
        <p>
          We retain your account and project data for as long as your account
          is active. If you delete your account or a project, the associated
          data is deleted from our production database. If you&apos;d like a
          copy of your data or to request deletion outside of the dashboard,
          email us at{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="underline underline-offset-2">
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection heading="5. Security">
        <p>
          Your Stripe restricted key is encrypted at rest (AES-256-GCM) and
          only decrypted server-side, in memory, when a customer accepts a
          save offer. All data in the database is isolated per account with
          row-level security, and all traffic to and from CancelKit is
          encrypted in transit (HTTPS/TLS).
        </p>
      </LegalSection>

      <LegalSection heading="6. Cookies">
        <p>
          We use a single first-party session cookie (set by Supabase Auth)
          to keep you logged in to the dashboard. We do not use advertising,
          analytics, or third-party tracking cookies.
        </p>
      </LegalSection>

      <LegalSection heading="7. Children's privacy">
        <p>
          CancelKit is a business tool and is not directed at, or intended
          for use by, children under the age of 16.
        </p>
      </LegalSection>

      <LegalSection heading="8. Changes to this policy">
        <p>
          If we make material changes to this policy, we&apos;ll update the
          effective date above and, where appropriate, notify you by email.
        </p>
      </LegalSection>

      <LegalSection heading="9. Contact">
        <p>
          Questions about this policy or your data? Email{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="underline underline-offset-2">
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      </LegalSection>
    </LegalShell>
  );
}
