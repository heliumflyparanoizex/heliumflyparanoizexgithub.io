## 2024-05-24 - Focus Visibility using Utility Classes
**Learning:** Adding accessible focus states to interactive UI elements that lack them is critical for keyboard navigation. Using existing Tailwind utility classes (e.g., `focus-visible:ring-2`, `focus-visible:outline-none`, `focus-visible:ring-{color}`) provides an immediate, semantic way to introduce focus visibility without creating custom CSS overrides, keeping the styling tightly coupled to the component architecture.
**Action:** When working in codebases that utilize Tailwind CSS, always prioritize `focus-visible` utility classes for accessible focus styling on interactive elements (buttons, links) rather than relying on custom CSS styles.

## 2024-05-01 - Keyboard Accessibility Focus
**Learning:** Tailwind classes like `focus-visible:ring-2` loaded via CDN are inert as the CDN build lacks the arbitrary value processing step. Keyboard accessibility states (like focus rings) require custom CSS implementation.
**Action:** Always implement `:focus-visible` styles explicitly in `style.css` using native CSS and design tokens instead of relying on utility classes for interactive accessibility states.
