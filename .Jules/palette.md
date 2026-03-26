## 2024-05-24 - Focus Visibility using Utility Classes
**Learning:** Adding accessible focus states to interactive UI elements that lack them is critical for keyboard navigation. Using existing Tailwind utility classes (e.g., `focus-visible:ring-2`, `focus-visible:outline-none`, `focus-visible:ring-{color}`) provides an immediate, semantic way to introduce focus visibility without creating custom CSS overrides, keeping the styling tightly coupled to the component architecture.
**Action:** When working in codebases that utilize Tailwind CSS, always prioritize `focus-visible` utility classes for accessible focus styling on interactive elements (buttons, links) rather than relying on custom CSS styles.

## 2026-03-26 - Custom Modal Focus Management
**Learning:** When implementing custom modals or lightboxes, focus management is essential for keyboard accessibility. When a modal opens, focus must be trapped within it or shifted to its first interactive element (like the close button). More importantly, the element that triggered the modal must be remembered (`lastFocusedElement`), and focus must be programmatically returned to it when the modal closes. Without this, keyboard users lose their place on the page.
**Action:** Always implement a `lastFocusedElement` tracking pattern when building or modifying custom modal interactions.
