from playwright.sync_api import sync_playwright

def verify_sphere():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to local server
        page.goto("http://localhost:8000")

        # Wait for preloader to finish (approx 1.5s in script.js)
        page.wait_for_timeout(3000)

        # Check if webgl canvas exists and is visible
        canvas = page.locator("#webgl-experience")
        if canvas.is_visible():
            print("WebGL Canvas is visible.")
        else:
            print("WebGL Canvas is NOT visible.")

        # Check if background container is hidden
        bg = page.locator("#bg-container")
        display = bg.evaluate("element => getComputedStyle(element).display")
        print(f"Background display style: {display}")

        # Take screenshot of Hero section
        page.screenshot(path="verification_fixed.png")

        browser.close()

if __name__ == "__main__":
    verify_sphere()
