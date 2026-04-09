## 2024-05-24 - Focus Visibility using Utility Classes
**Learning:** Adding accessible focus states to interactive UI elements that lack them is critical for keyboard navigation. Using existing Tailwind utility classes (e.g., `focus-visible:ring-2`, `focus-visible:outline-none`, `focus-visible:ring-{color}`) provides an immediate, semantic way to introduce focus visibility without creating custom CSS overrides, keeping the styling tightly coupled to the component architecture.
**Action:** When working in codebases that utilize Tailwind CSS, always prioritize `focus-visible` utility classes for accessible focus styling on interactive elements (buttons, links) rather than relying on custom CSS styles.

## 2024-05-25 - Focus Management in Dynamic Modals
**Learning:** When implementing or modifying custom modals/lightboxes (like the dynamic gallery), simply making the trigger elements focusable isn't enough. It is crucial to capture the previously focused element (`lastFocusedElement`) on open, shift focus inside the modal (e.g., to the close button), and restore focus on close to maintain a robust keyboard accessibility loop.
**Action:** Always implement comprehensive focus trapping and restoration logic for any newly added or modified custom dialog, lightbox, or modal component.
