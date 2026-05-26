## 2024-05-24 - Focus Visibility using Utility Classes
**Learning:** Adding accessible focus states to interactive UI elements that lack them is critical for keyboard navigation. Using existing Tailwind utility classes (e.g., `focus-visible:ring-2`, `focus-visible:outline-none`, `focus-visible:ring-{color}`) provides an immediate, semantic way to introduce focus visibility without creating custom CSS overrides, keeping the styling tightly coupled to the component architecture.
**Action:** When working in codebases that utilize Tailwind CSS, always prioritize `focus-visible` utility classes for accessible focus styling on interactive elements (buttons, links) rather than relying on custom CSS styles.

## 2026-05-26 - Added Skip to Main Content Link
**Learning:** Single-page applications with heavy top navigation structures, like this app, need an explicit way for keyboard-only users to bypass the menu and jump straight to the primary content area (`#inicio`).
**Action:** Always include a 'Skip to main content' link immediately after the `<body>` tag. Use Tailwind classes like `sr-only focus:not-sr-only focus:absolute z-[9999]` so it remains visually hidden until focused, and ensure bilingual attributes are applied.
