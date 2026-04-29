1. **Understand the problem**: The project lacks keyboard focus visibility for interactive elements like links and buttons. While the prompt mentioned `focus-visible:ring-2 focus-visible:ring-cyan-400` in `index.html`, Tailwind classes from CDN are inert and there are no custom `:focus-visible` styles in `style.css` for primary interactive elements (like `.nav-link`, `.btn`, `a`, `button`). This is a critical accessibility/UX issue.
2. **Review existing styles**: Find the `:focus-visible` rules in `style.css` (currently only `.close-lightbox:focus-visible` exists).
3. **Plan the fix**: Add generic `:focus-visible` rules to `style.css` for `a, button, input, textarea, select, [tabindex="0"]` to provide a clear, accessible focus ring using the existing `--color-primary` variable. Also add specific overrides if necessary (e.g. for `nav-link`).
4. **Implement the fix**: Append the following to `style.css` or insert it globally near the top:
   ```css
   /* Accessibility: Focus visible styles */
   a:focus-visible,
   button:focus-visible,
   input:focus-visible,
   textarea:focus-visible,
   select:focus-visible,
   [tabindex="0"]:focus-visible {
       outline: 2px solid var(--color-primary);
       outline-offset: 4px;
       border-radius: 2px;
   }
   ```
5. **Verify**: Check `style.css` and optionally run tests.
6. **Pre-commit**: Run pre-commit instructions.
7. **Submit**: Create PR with the requested title and description format.
