## 2024-05-24 - Focus Visibility using Utility Classes
**Learning:** Adding accessible focus states to interactive UI elements that lack them is critical for keyboard navigation. Using existing Tailwind utility classes (e.g., `focus-visible:ring-2`, `focus-visible:outline-none`, `focus-visible:ring-{color}`) provides an immediate, semantic way to introduce focus visibility without creating custom CSS overrides, keeping the styling tightly coupled to the component architecture.
**Action:** When working in codebases that utilize Tailwind CSS, always prioritize `focus-visible` utility classes for accessible focus styling on interactive elements (buttons, links) rather than relying on custom CSS styles.

## 2026-05-29 - Accessible Skip Link Pattern
**Learning:** The project relies on Tailwind classes. For focusable elements like skip links that must be visually hidden until focused, the `sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50` utility combination effectively supports keyboard accessibility while maintaining visual design boundaries.
**Action:** Use these specific Tailwind classes for hidden-until-focused elements, and always ensure the target container (e.g., `#inicio`) has `tabindex="-1"` to accept programmatic focus without entering the natural tab order.
