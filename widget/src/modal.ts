import { acceptSession, closeSession, createSession } from "./api";
import { h } from "./dom";
import { createFocusTrap } from "./focus-trap";
import { CANCELKIT_STYLES } from "./styles";
import type { ConfigResponse, OfferDTO, OpenOptions } from "./types";

type Step = "survey" | "offer" | "saved" | "error";

function describeOffer(offer: OfferDTO): string {
  if (offer.type === "discount") {
    const months = offer.durationMonths ?? 1;
    return `Get ${offer.percentOff ?? 0}% off for ${months} ${months === 1 ? "month" : "months"}.`;
  }
  const months = offer.pauseMonths ?? 1;
  return `Pause your subscription for ${months} ${months === 1 ? "month" : "months"} instead.`;
}

type ModalHooks = {
  /** CSP nonce for the injected <style>, so strict style-src hosts allow it (WID-4). */
  nonce?: string;
  /** Fired once when the modal closes, so the controller can release its single-instance lock (WID-2). */
  onClose?: () => void;
};

export function createModal(
  config: ConfigResponse,
  key: string,
  options: OpenOptions,
  hooks: ModalHooks = {},
) {
  const state: {
    step: Step;
    selectedReasonId: string | null;
    reasonText: string;
    sessionId: string | null;
    sessionToken: string | null;
    offer: OfferDTO | null;
  } = {
    step: "survey",
    selectedReasonId: null,
    reasonText: "",
    sessionId: null,
    sessionToken: null,
    offer: null,
  };

  const host = document.createElement("div");
  host.style.setProperty("--ck-accent", config.accentColor || "#6366F1");
  const shadow = host.attachShadow({ mode: "open" });

  const styleEl = document.createElement("style");
  if (hooks.nonce) styleEl.nonce = hooks.nonce;
  styleEl.textContent = CANCELKIT_STYLES;
  shadow.appendChild(styleEl);

  const dialog = h("div", {
    class: "ck-dialog",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Cancel subscription",
    tabindex: "-1",
  });
  const overlay = h("div", { class: "ck-overlay", role: "presentation" }, [dialog]);
  shadow.appendChild(overlay);

  let trap: ReturnType<typeof createFocusTrap> | null = null;
  let closed = false;
  let previouslyFocused: HTMLElement | null = null;
  // WID-1: remember the host's own body overflow so close() restores it exactly,
  // instead of clobbering a value the host page may be managing itself.
  let prevBodyOverflow = "";

  function render() {
    dialog.replaceChildren();
    dialog.appendChild(buildCloseButton());
    dialog.appendChild(buildProgressDots());

    if (state.step === "survey") dialog.appendChild(buildSurveyStep());
    else if (state.step === "offer") dialog.appendChild(buildOfferStep());
    else if (state.step === "error") dialog.appendChild(buildErrorStep());
    else dialog.appendChild(buildSavedStep());

    if (config.poweredByBadge) dialog.appendChild(h("div", { class: "ck-badge" }, ["Powered by CancelKit"]));
  }

  function buildCloseButton() {
    const btn = h("button", { class: "ck-close", type: "button", "aria-label": "Close" }, ["✕"]);
    btn.addEventListener("click", () => close("abandoned"));
    return btn;
  }

  function buildProgressDots() {
    const active = state.step === "survey" ? 0 : 1;
    return h("div", { class: "ck-dots" }, [
      h("span", { class: active === 0 ? "ck-dot ck-dot-active" : "ck-dot" }),
      h("span", { class: active === 1 ? "ck-dot ck-dot-active" : "ck-dot" }),
    ]);
  }

  function buildContinueCancelLink(onClick: () => void) {
    const link = h("button", { class: "ck-link", type: "button" }, ["Continue to cancel"]);
    link.addEventListener("click", onClick);
    return link;
  }

  function buildSurveyStep() {
    const wrap = h("div", { class: "ck-step" }, [
      h("h2", { class: "ck-title" }, ["Before you go — why are you cancelling?"]),
    ]);

    const list = h("div", { class: "ck-reasons", role: "radiogroup", "aria-label": "Cancellation reason" });
    config.reasons.forEach((reason, index) => {
      const inputId = `ck-reason-${index}`;
      const input = h("input", { type: "radio", name: "ck-reason", id: inputId, value: reason.id });
      input.addEventListener("change", () => {
        state.selectedReasonId = reason.id;
      });
      const label = h("label", { class: "ck-reason", for: inputId }, [input, reason.label]);
      list.appendChild(label);
    });
    wrap.appendChild(list);

    const textarea = h("textarea", {
      class: "ck-textarea",
      placeholder: "Anything else you'd like to share? (optional)",
      "aria-label": "Additional feedback",
    });
    textarea.addEventListener("input", () => {
      state.reasonText = textarea.value;
    });
    wrap.appendChild(textarea);

    const continueBtn = h("button", { class: "ck-btn-primary", type: "button" }, ["Continue"]);
    continueBtn.addEventListener("click", () => void handleSurveySubmit());
    wrap.appendChild(continueBtn);

    wrap.appendChild(
      buildContinueCancelLink(() => {
        options.onContinueCancel?.({ customerId: options.customerId });
        close(null);
      }),
    );

    return wrap;
  }

  async function handleSurveySubmit() {
    try {
      const result = await createSession(key, {
        reasonId: state.selectedReasonId ?? undefined,
        reasonText: state.reasonText || undefined,
        customerId: options.customerId,
        customerEmail: options.customerEmail,
      });
      state.sessionId = result.sessionId;
      state.sessionToken = result.sessionToken;
      state.offer = result.offer;

      if (state.offer) {
        state.step = "offer";
        render();
        focusDialog();
        return;
      }

      // No active offer configured for this project — nothing to retain the customer with.
      if (state.sessionId && state.sessionToken) {
        closeSession(key, state.sessionId, state.sessionToken, "churned").catch(() => {});
      }
      options.onContinueCancel?.({
        customerId: options.customerId,
        reasonId: state.selectedReasonId ?? undefined,
      });
      close(null);
    } catch {
      // Network/API failure: never trap the visitor in a broken widget.
      options.onContinueCancel?.({ customerId: options.customerId });
      close(null);
    }
  }

  function buildOfferStep() {
    const offer = state.offer;
    if (!offer) return h("div", { class: "ck-step" });

    const wrap = h("div", { class: "ck-step" }, [
      h("h2", { class: "ck-title" }, [offer.headline]),
      h("p", { class: "ck-subtitle" }, [describeOffer(offer)]),
    ]);

    const acceptBtn = h("button", { class: "ck-btn-primary", type: "button" }, ["Accept offer"]);
    const declineLink = buildContinueCancelLink(() => {
      if (acceptBtn.disabled) return;
      void handleDecline();
    });
    acceptBtn.addEventListener("click", () => {
      if (acceptBtn.disabled) return;
      acceptBtn.disabled = true;
      acceptBtn.textContent = "Applying…";
      void handleAccept();
    });
    wrap.appendChild(acceptBtn);
    wrap.appendChild(declineLink);

    return wrap;
  }

  async function handleAccept() {
    if (!state.sessionId || !state.sessionToken) return;
    try {
      await acceptSession(key, state.sessionId, state.sessionToken);
      state.step = "saved";
    } catch {
      // Stripe (or our API) failed — the subscription was NOT changed.
      // Show the graceful error state instead of a false confirmation;
      // the host site keeps working either way.
      state.step = "error";
    }
    render();
    focusDialog();
  }

  function buildErrorStep() {
    const wrap = h("div", { class: "ck-step" }, [
      h("h2", { class: "ck-title" }, ["We couldn't apply the offer"]),
      h("p", { class: "ck-subtitle" }, [
        "Something went wrong on our side and your subscription was not changed. Please try again later, or contact support to complete your cancellation.",
      ]),
    ]);

    const closeBtn = h("button", { class: "ck-btn-primary", type: "button" }, ["Close"]);
    closeBtn.addEventListener("click", () => close("abandoned"));
    wrap.appendChild(closeBtn);

    wrap.appendChild(buildContinueCancelLink(() => void handleDecline()));

    return wrap;
  }

  async function handleDecline() {
    if (state.sessionId && state.sessionToken) {
      closeSession(key, state.sessionId, state.sessionToken, "churned").catch(() => {});
    }
    options.onContinueCancel?.({
      customerId: options.customerId,
      reasonId: state.selectedReasonId ?? undefined,
    });
    close(null);
  }

  function buildSavedStep() {
    const wrap = h("div", { class: "ck-step" }, [
      h("h2", { class: "ck-title" }, ["You're all set"]),
      h("p", { class: "ck-subtitle" }, ["Your offer has been applied. No further action is needed."]),
    ]);
    const doneBtn = h("button", { class: "ck-btn-primary", type: "button" }, ["Done"]);
    doneBtn.addEventListener("click", () => close(null));
    wrap.appendChild(doneBtn);
    return wrap;
  }

  function focusDialog() {
    trap?.destroy();
    trap = createFocusTrap(dialog);
    trap.focusFirst();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") close("abandoned");
  }

  function handleOverlayClick(event: MouseEvent) {
    if (event.target === overlay) close("abandoned");
  }

  function open() {
    previouslyFocused = document.activeElement as HTMLElement | null;
    prevBodyOverflow = document.body.style.overflow;
    document.body.appendChild(host);
    document.body.style.overflow = "hidden";
    render();
    overlay.addEventListener("click", handleOverlayClick);
    shadow.addEventListener("keydown", handleKeydown as EventListener);
    focusDialog();
  }

  function close(outcome: "abandoned" | null) {
    if (closed) return;
    closed = true;
    if (outcome === "abandoned" && state.sessionId && state.sessionToken) {
      closeSession(key, state.sessionId, state.sessionToken, "abandoned").catch(() => {});
    }
    trap?.destroy();
    overlay.removeEventListener("click", handleOverlayClick);
    shadow.removeEventListener("keydown", handleKeydown as EventListener);
    document.body.style.overflow = prevBodyOverflow;
    host.remove();
    previouslyFocused?.focus();
    hooks.onClose?.();
  }

  return { open };
}
