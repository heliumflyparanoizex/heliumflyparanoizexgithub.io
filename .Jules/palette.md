## 2024-05-24 - Focus Visibility using Utility Classes
**Learning:** Adding accessible focus states to interactive UI elements that lack them is critical for keyboard navigation. Using existing Tailwind utility classes (e.g., `focus-visible:ring-2`, `focus-visible:outline-none`, `focus-visible:ring-{color}`) provides an immediate, semantic way to introduce focus visibility without creating custom CSS overrides, keeping the styling tightly coupled to the component architecture.
**Action:** When working in codebases that utilize Tailwind CSS, always prioritize `focus-visible` utility classes for accessible focus styling on interactive elements (buttons, links) rather than relying on custom CSS styles.

## 2026-05-27 - Focus Visibility using Utility Classes for Skip-to-Content Link
**Learning:** Implementing a hidden skip-to-content link requires careful handling of focus visibility. Tailwind's  coupled with  allows creating robust keyboard navigation hooks that remain completely hidden from mouse/touch users while providing clear visual feedback when accessed via keyboard.
**Action:** When creating 'Skip to main content' links, combine  with  and explicit focus indicators to ensure immediate accessibility without compromising visual design.

## 2026-05-27 - Focus Visibility using Utility Classes for Skip-to-Content Link
**Learning:** Implementing a hidden skip-to-content link requires careful handling of focus visibility. Tailwind's `focus:not-sr-only` coupled with `focus-visible:ring-2` allows creating robust keyboard navigation hooks that remain completely hidden from mouse/touch users while providing clear visual feedback when accessed via keyboard.
**Action:** When creating 'Skip to main content' links, combine `sr-only` with `focus:not-sr-only focus:absolute z-[9999]` and explicit focus indicators to ensure immediate accessibility without compromising visual design.
