## 2024-05-24 - Focus Visibility using Utility Classes
**Learning:** Adding accessible focus states to interactive UI elements that lack them is critical for keyboard navigation. Using existing Tailwind utility classes (e.g., `focus-visible:ring-2`, `focus-visible:outline-none`, `focus-visible:ring-{color}`) provides an immediate, semantic way to introduce focus visibility without creating custom CSS overrides, keeping the styling tightly coupled to the component architecture.
**Action:** When working in codebases that utilize Tailwind CSS, always prioritize `focus-visible` utility classes for accessible focus styling on interactive elements (buttons, links) rather than relying on custom CSS styles.

## 2024-06-25 - Focus Management in Custom Modals
**Learning:** Custom modals and lightboxes (like the dynamic image gallery) often completely disrupt keyboard accessibility if focus isn't carefully managed. A critical pattern involves saving the `document.activeElement` when the modal opens, shifting focus inside the modal (e.g., to the close button), and restoring focus to the originally active element when the modal is closed.
**Action:** When implementing or modifying custom modal/lightbox functionality, explicitly script focus transitions (`element.focus()`) to maintain a predictable tab order, ensuring screen reader and keyboard-only users aren't left trapped or disoriented.
