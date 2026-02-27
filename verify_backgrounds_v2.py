from playwright.sync_api import sync_playwright

def verify_backgrounds():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to local server
        page.goto("http://localhost:8000")

        # Wait longer for preloader to finish (increase from 3s to 5s)
        page.wait_for_timeout(5000)

        # Take screenshot of Hero section showing the new background
        page.screenshot(path="verification_backgrounds_2.png")

        browser.close()

if __name__ == "__main__":
    verify_backgrounds()
