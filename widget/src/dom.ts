type Attrs = Record<string, string | undefined>;

/** Minimal element builder — the widget stays framework-free (no JSX/React). */
export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Attrs = {},
  children: (Node | string)[] = [],
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === undefined) continue;
    if (key === "class") element.className = value;
    else element.setAttribute(key, value);
  }
  for (const child of children) {
    element.append(typeof child === "string" ? document.createTextNode(child) : child);
  }
  return element;
}
