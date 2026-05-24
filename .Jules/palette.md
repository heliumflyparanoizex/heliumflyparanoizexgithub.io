## 2024-05-24 - Focus Visibility using Utility Classes
**Learning:** Adding accessible focus states to interactive UI elements that lack them is critical for keyboard navigation. Using existing Tailwind utility classes (e.g., `focus-visible:ring-2`, `focus-visible:outline-none`, `focus-visible:ring-{color}`) provides an immediate, semantic way to introduce focus visibility without creating custom CSS overrides, keeping the styling tightly coupled to the component architecture.
**Action:** When working in codebases that utilize Tailwind CSS, always prioritize `focus-visible` utility classes for accessible focus styling on interactive elements (buttons, links) rather than relying on custom CSS styles.

## 2024-05-24 - Skip Links for Heavy Navigation
**Learning:** For SPAs or single-page portfolios with heavy fixed top navigation or many header sections, adding a visually hidden 'Skip to main content' link as the first focusable element significantly improves keyboard navigation. Tailwind's `sr-only` and `focus:not-sr-only` classes provide an elegant, CSS-free way to implement this pattern.
**Action:** Always include a 'skip link' right after the opening `<body>` tag on pages with substantial pre-content navigation.
