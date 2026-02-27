from playwright.sync_api import sync_playwright
import time

def verify_backgrounds_debug():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Capture console logs
        page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))

        # Navigate
        print("Navigating...")
        page.goto("http://localhost:8000")

        # Wait for the script to potentially run (fallback is 5s)
        print("Waiting 6 seconds...")
        page.wait_for_timeout(6000)

        # Check BG Container HTML content to see if it was cleared/updated
        bg_html = page.locator("#bg-container").inner_html()
        print(f"BG Container HTML (first 500 chars): {bg_html[:500]}")

        # Check first layer specifically
        first_layer = page.locator("#bg-container .bg-layer").first
        if first_layer.count() > 0:
            bg_image = first_layer.evaluate("el => el.style.backgroundImage")
            print(f"First Layer BG Image: {bg_image}")

            expected_partial = "40dd707d91ad994cd68b8eaf80961eac.jpg"
            if expected_partial in bg_image:
                print("SUCCESS: Background updated to gallery image.")
            else:
                print("FAILURE: Background is still old or incorrect.")
        else:
            print("FAILURE: No bg layers found.")

        # Check preloader visibility
        preloader = page.locator("#preloader")
        opacity = preloader.evaluate("el => getComputedStyle(el).opacity")
        visibility = preloader.evaluate("el => getComputedStyle(el).visibility")
        print(f"Preloader Opacity: {opacity}, Visibility: {visibility}")

        page.screenshot(path="debug_verification.png")
        browser.close()

if __name__ == "__main__":
    verify_backgrounds_debug()
