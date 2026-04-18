## 2024-05-24 - Focus Visibility using Utility Classes
**Learning:** Adding accessible focus states to interactive UI elements that lack them is critical for keyboard navigation. Using existing Tailwind utility classes (e.g., `focus-visible:ring-2`, `focus-visible:outline-none`, `focus-visible:ring-{color}`) provides an immediate, semantic way to introduce focus visibility without creating custom CSS overrides, keeping the styling tightly coupled to the component architecture.
**Action:** When working in codebases that utilize Tailwind CSS, always prioritize `focus-visible` utility classes for accessible focus styling on interactive elements (buttons, links) rather than relying on custom CSS styles.

## 2025-10-24 - Robust Focus Management for Custom Modals
**Learning:** Dynamically generated custom modals (like lightboxes) require deliberate focus management to maintain keyboard accessibility, especially when they open over the rest of the UI.
**Action:** Always store the currently focused element (`document.activeElement`) before opening a modal, programmatically shift focus to the modal's close button or first interactive element upon opening, and restore focus to the stored element when the modal closes.
