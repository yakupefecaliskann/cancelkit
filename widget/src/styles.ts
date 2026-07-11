/**
 * Inlined into the Shadow DOM's <style> tag — never loaded from an external
 * stylesheet, no web fonts (UI_UX_GUIDELINES.md §5.3). Accent color is
 * supplied per-project via the --ck-accent custom property set on the host.
 */
export const CANCELKIT_STYLES = `
:host {
  all: initial;
  --ck-accent: #6366F1;
}

.ck-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 2147483647;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.ck-dialog {
  position: relative;
  width: 100%;
  max-width: 420px;
  background: #FFFFFF;
  color: #0F172A;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.2), 0 8px 10px -6px rgba(15, 23, 42, 0.15);
  padding: 28px 24px 20px;
  outline: none;
}

.ck-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: #64748B;
  font-size: 14px;
  line-height: 1;
  border-radius: 6px;
  cursor: pointer;
}

.ck-close:hover { background: #F8FAFC; }
.ck-close:focus-visible { outline: 2px solid var(--ck-accent); outline-offset: 2px; }

.ck-dots {
  display: flex;
  gap: 6px;
  margin-bottom: 16px;
}

.ck-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #E2E8F0;
}

.ck-dot-active { background: var(--ck-accent); }

.ck-step { display: flex; flex-direction: column; gap: 14px; }

.ck-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.35;
  letter-spacing: -0.01em;
}

.ck-subtitle {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: #64748B;
}

.ck-reasons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ck-reason {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}

.ck-reason:has(input:checked) {
  border-color: var(--ck-accent);
  background: color-mix(in srgb, var(--ck-accent) 8%, white);
}

.ck-reason input {
  accent-color: var(--ck-accent);
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.ck-textarea {
  width: 100%;
  min-height: 64px;
  resize: vertical;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  font-family: inherit;
  color: #0F172A;
}

.ck-textarea:focus-visible {
  outline: none;
  border-color: var(--ck-accent);
}

.ck-btn-primary {
  width: 100%;
  border: none;
  border-radius: 8px;
  background: var(--ck-accent);
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 600;
  padding: 11px 16px;
  cursor: pointer;
}

.ck-btn-primary:hover { filter: brightness(0.93); }
.ck-btn-primary:disabled { opacity: 0.6; cursor: wait; filter: none; }
.ck-btn-primary:focus-visible { outline: 2px solid var(--ck-accent); outline-offset: 2px; }

.ck-link {
  width: 100%;
  border: none;
  background: transparent;
  color: #64748B;
  font-size: 13px;
  text-decoration: underline;
  cursor: pointer;
  padding: 4px;
}

.ck-link:hover { color: #0F172A; }
.ck-link:focus-visible { outline: 2px solid var(--ck-accent); outline-offset: 2px; }

.ck-badge {
  text-align: center;
  margin-top: 18px;
  font-size: 12px;
  color: #94A3B8;
}
`;
