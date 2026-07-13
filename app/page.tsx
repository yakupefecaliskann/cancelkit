import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Code2,
  Link2,
  PlayCircle,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SUPPORT_EMAIL } from "@/lib/site";

// Title intentionally omitted: the root layout's default title applies here,
// and setting it again would get suffixed by the layout's title template.
export const metadata: Metadata = {
  description:
    "Drop one line of code into your cancel button. CancelKit shows an exit survey and an instant Stripe-powered save offer before your customer churns.",
};

const steps = [
  {
    icon: Link2,
    title: "Connect Stripe",
    description:
      "Paste a restricted API key. CancelKit never sees your full account — only what it needs to apply a discount or pause.",
  },
  {
    icon: Code2,
    title: "Add one line of code",
    description:
      "Drop a single <script> tag and a data-cancelkit attribute on your existing cancel button. No redesign required.",
  },
  {
    icon: TrendingUp,
    title: "Save revenue",
    description:
      "Cancelling customers see an exit survey, then an instant offer. Accept it, and Stripe applies the discount or pause automatically.",
  },
];

const features = [
  "14-day free trial, no card required",
  "Unlimited cancel sessions",
  "Native Stripe integration (discounts + pause)",
  "Exit survey with custom reasons",
  "Recovered MRR dashboard",
  "Cancel anytime",
];

const faqs = [
  {
    question: "Does this replace my Stripe billing portal?",
    answer:
      "No. CancelKit sits in front of your existing cancel button. If the customer declines every offer, they fall straight back into your normal cancellation flow — nothing is blocked or hidden.",
  },
  {
    question: "What Stripe permissions does CancelKit need?",
    answer:
      "A restricted API key with access to customers, subscriptions, and coupons — nothing else. Your key is encrypted at rest (AES-256-GCM) and only decrypted server-side when a customer accepts an offer.",
  },
  {
    question: "Will this slow down my site?",
    answer:
      "The embed script is under 30KB gzipped, loads asynchronously, and doesn't pull in any fonts or external stylesheets. It only renders when a customer clicks cancel.",
  },
  {
    question: "What happens after the 14-day trial?",
    answer:
      "If you don't upgrade, the widget stops opening on your site (your cancel button still works — it just falls back to your normal flow) and your dashboard shows an upgrade prompt. No surprise charges.",
  },
  {
    question: "Who is CancelKit built for?",
    answer:
      "Indie and bootstrapped SaaS founders running subscriptions on Stripe — typically $500–$20k MRR — who want to recover revenue without building a churn-prevention flow themselves.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border/60 bg-[#0f172a]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-heading text-lg font-semibold tracking-tight text-white">
            CancelKit
          </span>
          <nav className="hidden items-center gap-8 text-sm text-slate-300 sm:flex">
            <a href="#how-it-works" className="transition-colors hover:text-white">
              How it works
            </a>
            <a href="#pricing" className="transition-colors hover:text-white">
              Pricing
            </a>
            <a href="#faq" className="transition-colors hover:text-white">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-slate-300 transition-colors hover:text-white sm:inline"
            >
              Log in
            </Link>
            <Button
              render={<Link href="/login" />}
              nativeButton={false}
              className="bg-white text-[#0f172a] hover:bg-slate-200"
            >
              Start free trial
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0f172a]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 0%, rgba(99,102,241,0.25) 0%, rgba(15,23,42,0) 70%)",
          }}
        />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-14 px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="flex max-w-3xl flex-col items-center gap-6 text-center">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
              Built for indie Stripe SaaS founders
            </span>
            <h1 className="text-balance font-heading text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              Turn cancellations into saved revenue.
            </h1>
            <p className="text-balance max-w-xl text-base text-slate-300 sm:text-lg">
              CancelKit drops an exit survey and an instant Stripe-powered save
              offer in front of every cancel button — so fewer subscribers
              actually leave.
            </p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <Button
                render={<Link href="/login" />}
                nativeButton={false}
                size="lg"
                className="h-11 gap-2 bg-primary px-6 text-base hover:bg-primary/90"
              >
                Start your 14-day free trial
                <ArrowRight className="size-4" />
              </Button>
              <Button
                render={<Link href="/demo" />}
                nativeButton={false}
                size="lg"
                variant="outline"
                className="h-11 gap-2 border-white/15 bg-transparent px-6 text-base text-white hover:bg-white/10"
              >
                <PlayCircle className="size-4" />
                Try the cancel flow
              </Button>
            </div>
          </div>

          {/* Mock dashboard card */}
          <Card className="w-full max-w-lg border-white/10 bg-slate-900/80 py-0 shadow-2xl ring-1 ring-white/10 backdrop-blur">
            <CardContent className="grid gap-6 p-6 sm:grid-cols-[auto_1fr] sm:items-end">
              <div>
                <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">
                  Recovered this month
                </p>
                <p className="mt-1 text-4xl font-semibold tabular-nums tracking-tight text-white">
                  $18,240
                </p>
                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
                  <TrendingUp className="size-3" />
                  62% save rate
                </span>
              </div>
              <div className="flex h-20 items-end gap-1.5">
                {[38, 52, 44, 61, 55, 70, 64, 82, 76, 90, 84, 100].map(
                  (h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm bg-gradient-to-t from-primary/40 to-primary"
                      style={{ height: `${h}%` }}
                    />
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Live in under 10 minutes
          </h2>
          <p className="mt-3 text-muted-foreground">
            No feature flags, no engineering sprint — just Stripe and one
            script tag.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <Card key={step.title} className="relative">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <step.icon className="size-4.5" />
                  </span>
                  <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Step {i + 1}
                  </span>
                </div>
                <CardTitle className="mt-2 text-lg">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {step.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Live demo */}
      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-20 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="size-5" />
          </span>
          <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            See the real product, not a mockup
          </h2>
          <p className="max-w-xl text-muted-foreground">
            The demo page runs the actual CancelKit widget — the exact survey
            and save-offer flow your customers will see.
          </p>
          <Button render={<Link href="/demo" />} nativeButton={false} size="lg" className="h-11 gap-2 px-6 text-base">
            <PlayCircle className="size-4" />
            Try the cancel flow
          </Button>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Simple, predictable pricing
          </h2>
          <p className="mt-3 text-muted-foreground">
            One plan. No per-seat pricing, no usage tiers.
          </p>
        </div>
        <Card className="mx-auto mt-12 max-w-md border-primary/20 shadow-lg ring-1 ring-primary/10">
          <CardHeader className="items-center text-center">
            <CardTitle className="text-base font-medium text-muted-foreground">
              Pro
            </CardTitle>
            <div className="mt-2 flex items-baseline justify-center gap-1">
              <span className="text-5xl font-semibold tracking-tight tabular-nums">
                $29
              </span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <ul className="flex flex-col gap-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              render={<Link href="/login" />}
              nativeButton={false}
              size="lg"
              className="h-11 w-full text-base"
            >
              Start your 14-day free trial
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-border bg-muted/40">
        <div className="mx-auto max-w-3xl px-6 py-24">
          <h2 className="text-center font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
          <Accordion className="mt-10">
            {faqs.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question}>
                <AccordionTrigger className="text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-10 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <span className="font-heading font-semibold text-foreground">
            CancelKit
          </span>
          <nav className="flex flex-wrap items-center justify-center gap-6">
            <a href="#how-it-works" className="hover:text-foreground">
              How it works
            </a>
            <a href="#pricing" className="hover:text-foreground">
              Pricing
            </a>
            <a href="#faq" className="hover:text-foreground">
              FAQ
            </a>
            <Link href="/login" className="hover:text-foreground">
              Log in
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="/refund" className="hover:text-foreground">
              Refunds
            </Link>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              title={SUPPORT_EMAIL}
              className="hover:text-foreground"
            >
              Support
            </a>
          </nav>
          <span>&copy; {new Date().getFullYear()} CancelKit. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
