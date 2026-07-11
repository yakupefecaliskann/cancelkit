import { CancelKitController } from "./controller";
import type { InitOptions, OpenOptions } from "./types";

declare global {
  interface Window {
    CancelKit?: {
      init: (options?: InitOptions) => void;
      open: (options?: OpenOptions) => void;
    };
  }
}

function resolveScriptEl(): HTMLScriptElement | null {
  const current = document.currentScript as HTMLScriptElement | null;
  if (current?.dataset.key) return current;

  const candidates = document.querySelectorAll<HTMLScriptElement>("script[data-key]");
  // WID-3: with document.currentScript unavailable (async/injected scripts), we
  // fall back to the last data-key script. If a page embeds two *different*
  // project keys this is ambiguous — warn rather than silently misattribute.
  const distinctKeys = new Set(
    Array.from(candidates, (el) => el.dataset.key).filter(Boolean),
  );
  if (distinctKeys.size > 1) {
    console.warn("[CancelKit] Multiple distinct data-key scripts found; using the last one.");
  }
  return candidates[candidates.length - 1] ?? null;
}

function boot() {
  const script = resolveScriptEl();
  const key = script?.dataset.key ?? "";
  const nonce = script?.nonce || script?.dataset.ckNonce || undefined;
  const controller = new CancelKitController(key, nonce);
  controller.init();

  window.CancelKit = {
    init: (options) => controller.init(options),
    open: (options) => void controller.open(options),
  };
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
