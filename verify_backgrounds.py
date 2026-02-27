from playwright.sync_api import sync_playwright

def verify_backgrounds():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to local server
        page.goto("http://localhost:8000")

        # Wait for preloader to finish
        page.wait_for_timeout(3000)

        # Check if webgl canvas is hidden
        canvas = page.locator("#webgl-experience")
        canvas_display = canvas.evaluate("element => getComputedStyle(element).display")
        print(f"WebGL Canvas display: {canvas_display}")

        # Check if bg-container is visible
        bg_container = page.locator("#bg-container")
        bg_display = bg_container.evaluate("element => getComputedStyle(element).display")
        print(f"Background Container display: {bg_display}")

        # Check if layers were generated inside bg-container
        layers_count = bg_container.locator(".bg-layer").count()
        print(f"Background Layers generated: {layers_count}")

        # Check if the first layer has a background image and is active
        first_layer = bg_container.locator(".bg-layer").first
        first_layer_bg = first_layer.evaluate("element => element.style.backgroundImage")
        first_layer_class = first_layer.get_attribute("class")
        print(f"First Layer BG: {first_layer_bg}")
        print(f"First Layer Class: {first_layer_class}")

        # Check if Gallery section is hidden
        gallery_section = page.locator("#galeria")
        gallery_display = gallery_section.evaluate("element => getComputedStyle(element).display")
        print(f"Gallery Section display: {gallery_display}")

        # Take screenshot of Hero section showing the new background
        page.screenshot(path="verification_backgrounds.png")

        browser.close()

if __name__ == "__main__":
    verify_backgrounds()
