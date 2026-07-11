import { expect, test, type Page } from "@playwright/test";

/**
 * E2E: the full cancel flow on /demo — widget renders inside its Shadow DOM,
 * a cancellation reason is picked, the retention offer is shown, and accepting
 * the discount lands on the "You're all set" confirmation.
 *
 * The three widget API endpoints are fulfilled with deterministic fixtures via
 * page.route(), so the test exercises the real demo page + the real compiled
 * widget bundle (public/v1.js) in a real browser without needing local
 * Supabase or stripe-mock to be running. The request payloads the widget
 * sends are still asserted against the API contract (ARCHITECTURE §3.2).
 */

const PK = "pk_live_e2e_test_key";
const SESSION_ID = "sess_e2e_0001";
const SESSION_TOKEN = "tok_e2e_secret";
const REASON_PRICE_ID = "reason_price";

const OFFER = {
  id: "offer_discount_1",
  type: "discount",
  headline: "How about 20% off instead?",
  percentOff: 20,
  durationMonths: 3,
  pauseMonths: null,
};

const CONFIG_RESPONSE = {
  projectId: "proj_e2e",
  accentColor: "#6366F1",
  poweredByBadge: true,
  reasons: [
    { id: REASON_PRICE_ID, label: "Too expensive" },
    { id: "reason_missing", label: "Missing features" },
    { id: "reason_unused", label: "Not using it enough" },
  ],
  offers: [OFFER],
};

type CapturedRequests = {
  createSessionBody: Record<string, unknown> | null;
  acceptBody: Record<string, unknown> | null;
  closeBody: Record<string, unknown> | null;
};

async function mockWidgetApi(page: Page): Promise<CapturedRequests> {
  const captured: CapturedRequests = {
    createSessionBody: null,
    acceptBody: null,
    closeBody: null,
  };

  await page.route(/\/api\/v1\/config\?/, (route) =>
    route.fulfill({ json: CONFIG_RESPONSE }),
  );

  await page.route(/\/api\/v1\/sessions\?/, (route) => {
    captured.createSessionBody = route.request().postDataJSON();
    return route.fulfill({
      json: { sessionId: SESSION_ID, sessionToken: SESSION_TOKEN, offer: OFFER },
    });
  });

  await page.route(new RegExp(`/api/v1/sessions/${SESSION_ID}/accept`), (route) => {
    captured.acceptBody = route.request().postDataJSON();
    return route.fulfill({ json: { ok: true, outcome: "saved" } });
  });

  await page.route(new RegExp(`/api/v1/sessions/${SESSION_ID}/close`), (route) => {
    captured.closeBody = route.request().postDataJSON();
    return route.fulfill({ json: { ok: true } });
  });

  return captured;
}

test.describe("CancelKit widget — /demo cancel flow", () => {
  test("survey → offer → accept discount → saved confirmation", async ({ page }) => {
    const captured = await mockWidgetApi(page);

    // The ?key= param makes the demo page inject the widget script with this key.
    await page.goto(`/demo?key=${PK}`);
    await expect(
      page.getByRole("heading", { name: "CancelKit widget demo" }),
    ).toBeVisible();

    // Widget script loaded and bound its [data-cancelkit] trigger.
    await expect(page.getByText("Widget script loaded.")).toBeVisible();

    // Step 0 — open the modal from the fake "Cancel subscription" button.
    await page.getByRole("button", { name: "Cancel subscription" }).click();

    // Playwright locators pierce the open Shadow DOM automatically.
    const dialog = page.getByRole("dialog", { name: "Cancel subscription" });
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole("heading", { name: "Before you go — why are you cancelling?" }),
    ).toBeVisible();
    await expect(dialog.getByText("Powered by CancelKit")).toBeVisible();

    // Step 1 — pick a cancellation reason (+ optional free text) and continue.
    const reasonRadio = dialog.getByRole("radio", { name: "Too expensive" });
    await reasonRadio.check();
    await expect(reasonRadio).toBeChecked();
    await dialog
      .getByRole("textbox", { name: "Additional feedback" })
      .fill("Budget cuts this quarter.");
    await dialog.getByRole("button", { name: "Continue", exact: true }).click();

    // Step 2 — the retention offer is presented.
    await expect(
      dialog.getByRole("heading", { name: OFFER.headline }),
    ).toBeVisible();
    await expect(dialog.getByText("Get 20% off for 3 months.")).toBeVisible();
    await expect(
      dialog.getByRole("button", { name: "Continue to cancel" }),
    ).toBeVisible();

    // The session was created with exactly what the user entered.
    expect(captured.createSessionBody).toMatchObject({
      reasonId: REASON_PRICE_ID,
      reasonText: "Budget cuts this quarter.",
      customerId: "demo_customer_123",
      customerEmail: "demo@customer.test",
    });

    // Step 3 — accept the discount.
    await dialog.getByRole("button", { name: "Accept offer" }).click();

    // Success screen: the offer was applied, the customer is saved.
    await expect(dialog.getByRole("heading", { name: "You're all set" })).toBeVisible();
    await expect(
      dialog.getByText("Your offer has been applied. No further action is needed."),
    ).toBeVisible();

    // Accept was authorized with the session token issued at creation.
    expect(captured.acceptBody).toMatchObject({ sessionToken: SESSION_TOKEN });
    // A successful save must never also close the session as churned/abandoned.
    expect(captured.closeBody).toBeNull();

    // Step 4 — "Done" closes the modal and the host page is intact.
    await dialog.getByRole("button", { name: "Done" }).click();
    await expect(dialog).toBeHidden();
    await expect(
      page.getByRole("button", { name: "Cancel subscription" }),
    ).toBeVisible();
  });

  test("declining the offer closes the modal and hands control back to the host", async ({
    page,
  }) => {
    const captured = await mockWidgetApi(page);

    await page.goto(`/demo?key=${PK}`);
    await expect(page.getByText("Widget script loaded.")).toBeVisible();

    await page.getByRole("button", { name: "Cancel subscription" }).click();
    const dialog = page.getByRole("dialog", { name: "Cancel subscription" });
    await dialog.getByRole("radio", { name: "Missing features" }).check();
    await dialog.getByRole("button", { name: "Continue", exact: true }).click();
    await expect(
      dialog.getByRole("heading", { name: OFFER.headline }),
    ).toBeVisible();

    await dialog.getByRole("button", { name: "Continue to cancel" }).click();

    // Modal closes, session is marked churned, and the demo page's
    // onContinueCancel callback fires with the picked reason.
    await expect(dialog).toBeHidden();
    await expect(
      page.getByText(
        "onContinueCancel fired — customerId=demo_customer_123, reasonId=reason_missing",
      ),
    ).toBeVisible();
    expect(captured.closeBody).toMatchObject({
      sessionToken: SESSION_TOKEN,
      outcome: "churned",
    });
  });
});
