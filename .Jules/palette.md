## 2024-05-24 - Accessibility and keyboard navigation in dynamically generated content

**Learning:** When generating interactive elements like the image gallery dynamically in JS, we need to explicitly set `tabindex`, `role="button"`, and handle keyboard events (Enter/Space) to trigger the same actions as mouse clicks, to ensure full keyboard navigation and accessibility. Additionally, focus should be managed properly when modals/lightboxes open and close. Also, setting ARIA attributes (like `aria-label`, `aria-hidden` on icons, `aria-selected` and `aria-controls` for tabs) are important. Adding visible focus indicators is also key to let keyboard users know which element is currently focused.

**Action:** Whenever dynamically generating interactive UI components like galleries or modals, ensure proper `tabindex`, keyboard event listeners, ARIA attributes, and visible focus styles are applied to these elements.
