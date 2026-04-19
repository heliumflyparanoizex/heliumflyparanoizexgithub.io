## 2024-05-24 - Focus Visibility using Utility Classes
**Learning:** Adding accessible focus states to interactive UI elements that lack them is critical for keyboard navigation. Using existing Tailwind utility classes (e.g., `focus-visible:ring-2`, `focus-visible:outline-none`, `focus-visible:ring-{color}`) provides an immediate, semantic way to introduce focus visibility without creating custom CSS overrides, keeping the styling tightly coupled to the component architecture.
**Action:** When working in codebases that utilize Tailwind CSS, always prioritize `focus-visible` utility classes for accessible focus styling on interactive elements (buttons, links) rather than relying on custom CSS styles.

## 2024-05-24 - Lightbox Modal Focus Management
**Learning:** When implementing custom modals like lightboxes, it's critical to manage focus to maintain keyboard accessibility. Not returning focus to the trigger element after the modal closes breaks the keyboard navigation flow and forces users to tab from the beginning of the document or an unpredictable location.
**Action:** Always implement a `lastFocusedElement` pattern for custom modals: save `document.activeElement` before opening, shift focus into the modal (e.g., to the close button), and explicitly call `.focus()` on the saved element when the modal closes (via click, Enter/Space, or Esc).
