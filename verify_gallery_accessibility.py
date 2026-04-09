from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:8080#galeria")
    page.wait_for_timeout(2000) # Wait for preload

    # Navigate to gallery container and verify items
    gallery_container = page.locator('#gallery-container')
    gallery_items = gallery_container.locator('.gallery-item')

    # Wait for the images to generate and appear
    gallery_items.first.wait_for(state="visible")

    # Focus the first gallery item using Tab key navigation
    page.keyboard.press("Tab")
    page.wait_for_timeout(500)

    # Actually focus the first gallery item by pressing Tab multiple times if needed
    # Or just programmatically focus it to demonstrate the focus outline
    first_item = gallery_items.first
    first_item.focus()
    page.wait_for_timeout(500)

    # Press Enter to trigger Lightbox via keyboard accessibility
    page.keyboard.press("Enter")
    page.wait_for_timeout(1000)

    # Lightbox should be open now.
    lightbox = page.locator('#lightbox')
    lightbox.wait_for(state="visible")

    # The close button should be focused
    close_btn = page.locator('.close-lightbox')
    page.wait_for_timeout(500)

    # Take screenshot of open lightbox
    page.screenshot(path="/home/jules/verification/screenshots/verification.png")

    # Press Escape to close the lightbox and verify focus returns
    page.keyboard.press("Escape")
    page.wait_for_timeout(1000)

    # Verify the lightbox is closed
    lightbox.wait_for(state="hidden")
    page.wait_for_timeout(1000)


if __name__ == "__main__":
    import os
    os.makedirs("/home/jules/verification/videos", exist_ok=True)
    os.makedirs("/home/jules/verification/screenshots", exist_ok=True)

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
