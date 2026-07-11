import { fetchConfig } from "./api";
import { createModal } from "./modal";
import type { ConfigResponse, InitOptions, OpenOptions } from "./types";

export class CancelKitController {
  private readonly key: string;
  private readonly nonce?: string;
  private config: ConfigResponse | null = null;
  private configPromise: Promise<ConfigResponse> | null = null;
  private defaultOnContinueCancel?: OpenOptions["onContinueCancel"];
  // WID-2: only one modal instance may be open at a time. A rapid double-click
  // or two triggers firing together must not stack two overlays (which would
  // then fight over document.body.style.overflow on close).
  private modalOpen = false;

  constructor(key: string, nonce?: string) {
    this.key = key;
    this.nonce = nonce;
  }

  init(options: InitOptions = {}): void {
    if (options.onContinueCancel) this.defaultOnContinueCancel = options.onContinueCancel;
    // Warm-up only: a failure here (network, inactive subscription → 403) is
    // handled at open() time, so swallow it instead of surfacing an unhandled
    // rejection in the host page's console.
    this.preloadConfig().catch(() => {});
    this.bindTriggers();
  }

  private preloadConfig(): Promise<ConfigResponse> {
    if (!this.configPromise) {
      this.configPromise = fetchConfig(this.key).then(
        (config) => {
          this.config = config;
          return config;
        },
        (err) => {
          // Don't cache the failure: the next click retries (a transient
          // network error must not permanently disable the widget).
          this.configPromise = null;
          throw err;
        },
      );
    }
    return this.configPromise;
  }

  private bindTriggers(): void {
    document.querySelectorAll<HTMLElement>("[data-cancelkit]").forEach((el) => {
      if (el.dataset.ckBound === "true") return;
      el.dataset.ckBound = "true";
      el.addEventListener("click", (event) => {
        event.preventDefault();
        void this.open({
          customerId: el.dataset.ckCustomer,
          customerEmail: el.dataset.ckEmail,
        });
      });
    });
  }

  async open(options: OpenOptions = {}): Promise<void> {
    if (!this.key) {
      console.error("[CancelKit] Missing data-key on the widget <script> tag.");
      return;
    }
    if (this.modalOpen) return;
    const onContinueCancel = options.onContinueCancel ?? this.defaultOnContinueCancel;
    try {
      const config = this.config ?? (await this.preloadConfig());
      this.modalOpen = true;
      createModal(
        config,
        this.key,
        { ...options, onContinueCancel },
        { nonce: this.nonce, onClose: () => { this.modalOpen = false; } },
      ).open();
    } catch {
      // Config unavailable (network error, or the account's subscription is
      // inactive → 403): never leave the host's cancel button dead — hand
      // control back to their own cancellation flow.
      console.error("[CancelKit] Widget disabled or config failed to load.");
      onContinueCancel?.({ customerId: options.customerId });
    }
  }
}
