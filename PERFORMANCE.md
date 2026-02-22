# Performance Optimization: Missing `poster` Attribute on Autoplay Video

## 🎯 Why (Rationale)

Adding a `poster` attribute to an autoplaying `<video>` tag is a key performance and UX best practice for several reasons:

1.  **Largest Contentful Paint (LCP) Improvement**: If the video is one of the largest elements in the viewport (as it is in the header of this site), the browser cannot calculate the LCP until the first frame of the video is rendered. A `poster` image allows the browser to display an image immediately and potentially record a faster LCP.
2.  **Reduced Layout Shift (CLS)**: Although the container has fixed dimensions in this case, the `poster` ensures the aspect ratio is respected and the space is filled correctly even before the video stream is initialized.
3.  **Perceived Performance**: Users see the logo image immediately instead of a blank or black space while the video buffer is loading.
4.  **Fallback Mechanism**: If the user has disabled autoplay, or if the video fails to load due to network issues, the `poster` image remains visible as a high-quality fallback.

## 📊 Measured Improvement

Since this is a perceived performance and LCP optimization, the improvement is best observed through browser profiling tools (like Lighthouse or Chrome DevTools Performance tab).

*   **Baseline**: Video loads without a poster, resulting in a potential "flash of black" or empty space during the initial page load while the MP4 file is being fetched and buffered.
*   **Post-Optimization**: The browser displays the `Logo-2025oct02-10-13-56p.m..png` image immediately upon HTML parsing, providing a seamless transition to the animated video once it's ready.
