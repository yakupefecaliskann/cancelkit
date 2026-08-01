import { expect, test } from "@playwright/test";

/**
 * E2E: public routing + every marketing/legal button and link.
 *
 * Complements widget.spec.ts (the cancel flow) by proving that no public
 * button or link "falls into the void": the landing-page CTAs route to the
 * right pages, the in-page anchors resolve to real sections, the FAQ accordion
 * opens, and every footer/legal link lands on a real, rendered page.
 *
 * These specs need no auth and no backend — the landing, login, demo and legal
 * routes render without a Supabase session — so they run against the real dev
 * server exactly as a first-time visitor would experience it.
 */

test.describe("Landing page — CTAs and links", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Turn cancellations into saved revenue." }),
    ).toBeVisible();
  });

  // The design-system Button renders these CTAs as <a href> elements but, via
  // base-ui's nativeButton={false}, exposes them with role="button" (an anchor
  // driven as a button). We assert the underlying href so a CTA can never point
  // at nothing, regardless of the ARIA role it carries.
  test("every primary CTA points at signup (/login)", async ({ page }) => {
    // Header "Get started free", hero "Get started — it's free", pricing
    // "Create your free account" are all free-signup entry points → /login.
    const signupCtas = page.getByRole("button", {
      name: /Get started|Create your free account/,
    });
    const count = await signupCtas.count();
    expect(count).toBeGreaterThanOrEqual(3);
    for (let i = 0; i < count; i++) {
      await expect(signupCtas.nth(i)).toHaveAttribute("href", "/login");
    }
  });

  test("both 'Try the cancel flow' buttons route to /demo", async ({ page }) => {
    const demoCtas = page.getByRole("button", { name: "Try the cancel flow" });
    await expect(demoCtas).toHaveCount(2);
    await expect(demoCtas.first()).toHaveAttribute("href", "/demo");
    await expect(demoCtas.last()).toHaveAttribute("href", "/demo");
  });

  test("header 'Get started free' actually navigates to the login page", async ({ page }) => {
    await page.getByRole("button", { name: "Get started free" }).click();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("button", { name: "Send magic link" })).toBeVisible();
  });

  test("in-page anchor nav resolves to real sections", async ({ page }) => {
    // Every anchor in the header must have a matching section id on the page,
    // otherwise the link scrolls nowhere.
    for (const [name, id] of [
      ["How it works", "how-it-works"],
      ["Pricing", "pricing"],
      ["FAQ", "faq"],
    ] as const) {
      const anchor = page.getByRole("navigation").getByRole("link", { name }).first();
      await expect(anchor).toHaveAttribute("href", `#${id}`);
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
  });

  test("FAQ accordion opens an answer on click", async ({ page }) => {
    const trigger = page.getByRole("button", {
      name: "Does this replace my Stripe billing portal?",
    });
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click();
    await expect(
      page.getByText("CancelKit sits in front of your existing cancel button", {
        exact: false,
      }),
    ).toBeVisible();
  });

  test("support link is a real mailto, not a dead '#'", async ({ page }) => {
    const support = page.getByRole("link", { name: "Support" });
    await expect(support).toHaveAttribute("href", /^mailto:.+@.+/);
  });
});

test.describe("Footer + legal routing", () => {
  const legalRoutes: Array<{ link: string; path: string; heading: string }> = [
    { link: "Privacy", path: "/privacy", heading: "Privacy Policy" },
    { link: "Terms", path: "/terms", heading: "Terms of Service" },
    { link: "Refunds", path: "/refund", heading: "Refund Policy" },
  ];

  for (const { link, path, heading } of legalRoutes) {
    test(`footer '${link}' navigates to ${path} and the page renders`, async ({ page }) => {
      await page.goto("/");
      await page.getByRole("contentinfo").getByRole("link", { name: link }).click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();

      // The legal shell's "Back to home" link returns to the landing page.
      await page.getByRole("link", { name: "Back to home" }).click();
      await expect(page).toHaveURL(/\/$/);
      await expect(
        page.getByRole("heading", { name: "Turn cancellations into saved revenue." }),
      ).toBeVisible();
    });
  }
});

test.describe("Auth + demo entry points render", () => {
  test("login page exposes both sign-in paths", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("button", { name: "Continue with Google" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Send magic link" })).toBeVisible();
    await expect(page.getByLabel("Work email")).toBeVisible();
  });

  test("login page surfaces the Google OAuth failure message from the query string", async ({
    page,
  }) => {
    await page.goto("/login?error=google_oauth_failed");
    await expect(page.getByText("Sign-in failed. Please try again")).toBeVisible();
  });

  test("login page also surfaces an auth callback failure (e.g. failed magic-link exchange)", async ({
    page,
  }) => {
    await page.goto("/login?error=auth_callback_failed");
    await expect(page.getByText("Sign-in failed. Please try again")).toBeVisible();
  });

  test("demo page loads its developer panel and fake cancel button", async ({ page }) => {
    await page.goto("/demo");
    await expect(
      page.getByRole("heading", { name: "CancelKit widget demo" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Cancel subscription" })).toBeVisible();
  });
});
