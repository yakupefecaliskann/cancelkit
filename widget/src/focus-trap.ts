const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function createFocusTrap(container: HTMLElement) {
  function getFocusable(): HTMLElement[] {
    return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
      (el) => el.offsetParent !== null,
    );
  }

  function activeElement(): Element | null {
    const root = container.getRootNode();
    return root instanceof ShadowRoot ? root.activeElement : document.activeElement;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key !== "Tab") return;
    const focusable = getFocusable();
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = activeElement();

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  container.addEventListener("keydown", handleKeydown);

  function focusFirst() {
    const focusable = getFocusable();
    (focusable[0] ?? container).focus();
  }

  function destroy() {
    container.removeEventListener("keydown", handleKeydown);
  }

  return { focusFirst, destroy };
}
