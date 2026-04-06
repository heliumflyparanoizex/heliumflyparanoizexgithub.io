from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:8080")
    # Wait for the preloader to disappear to be able to focus elements
    page.wait_for_selector('.hero-content', state='visible')
    page.wait_for_timeout(1000)

    # Focus the first language toggle button
    page.keyboard.press("Tab")
    page.wait_for_timeout(500)
    page.keyboard.press("Tab")
    page.wait_for_timeout(500)
    page.keyboard.press("Tab")
    page.wait_for_timeout(500)
    page.keyboard.press("Tab")
    page.wait_for_timeout(500)

    # Take screenshot at the key moment showing the focus ring
    page.screenshot(path="/home/jules/verification/screenshots/verification.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()