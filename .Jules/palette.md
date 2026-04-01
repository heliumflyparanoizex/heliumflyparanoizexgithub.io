## 2024-05-24 - Focus Visibility using Utility Classes
**Learning:** Adding accessible focus states to interactive UI elements that lack them is critical for keyboard navigation. Using existing Tailwind utility classes (e.g., `focus-visible:ring-2`, `focus-visible:outline-none`, `focus-visible:ring-{color}`) provides an immediate, semantic way to introduce focus visibility without creating custom CSS overrides, keeping the styling tightly coupled to the component architecture.
**Action:** When working in codebases that utilize Tailwind CSS, always prioritize `focus-visible` utility classes for accessible focus styling on interactive elements (buttons, links) rather than relying on custom CSS styles.

## 2024-05-25 - Focus Management in Custom Modals
**Learning:** For custom modals (like a dynamic image gallery lightbox), focus management is crucial for accessibility. A common pitfall is trapping users in the modal or returning them to the top of the document when closed.
**Action:** When creating custom modals, implement a focus management pattern:
1. Capture `document.activeElement` before opening the modal.
2. Shift focus to the first interactive element inside the modal (e.g., the close button) upon opening.
3. On modal close (via button, Escape key, or outside click), restore focus back to the captured element to maintain the user's place in the DOM flow.
