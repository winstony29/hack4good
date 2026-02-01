"""E2E test - browse as a user"""
import asyncio, os

async def run():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            executable_path="/usr/bin/chromium-browser",
            args=["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"]
        )
        ctx = await browser.new_context(viewport={"width": 1280, "height": 800})
        page = await ctx.new_page()
        D = "/tmp/hack4good_screenshots"
        os.makedirs(D, exist_ok=True)
        # Clean old screenshots
        for f in os.listdir(D): os.remove(f"{D}/{f}")
        
        R = []
        async def step(name, fn, shot=None):
            try:
                await fn()
                if shot: await page.screenshot(path=f"{D}/{shot}.png")
                R.append(f"✅ {name}")
            except Exception as e:
                if shot:
                    try: await page.screenshot(path=f"{D}/{shot}_ERR.png")
                    except: pass
                R.append(f"❌ {name}: {str(e)[:120]}")

        # 1. Landing
        await step("Landing page", lambda: page.goto("http://localhost:5173/", wait_until="networkidle", timeout=15000), "01_landing")
        
        # 2. Click Log In button on landing
        async def click_login():
            btn = page.locator("text=Log In").first
            await btn.click()
            await page.wait_for_timeout(2000)
        await step("Click Log In", click_login, "02_auth_page")
        R.append(f"   URL: {page.url}")
        
        # 3. Find form fields on auth page
        inputs = await page.query_selector_all("input")
        for inp in inputs:
            itype = await inp.get_attribute("type") or "?"
            iname = await inp.get_attribute("name") or await inp.get_attribute("placeholder") or "?"
            R.append(f"   Input: type={itype} name/placeholder={iname}")
        
        # 4. Login as participant
        async def login_participant():
            await page.fill('input[type="email"], input[name="email"], input[placeholder*="mail" i]', "participant@minds.demo")
            await page.fill('input[type="password"], input[name="password"], input[placeholder*="assword" i]', "Demo2026!")
            # Find and click submit
            await page.locator('button[type="submit"], button:has-text("Log In"), button:has-text("Sign In"), button:has-text("Login")').first.click()
            await page.wait_for_timeout(3000)
        await step("Login as participant", login_participant, "03_participant_home")
        R.append(f"   URL: {page.url}")
        
        # 5. Activities page
        await step("Activities page", lambda: page.goto("http://localhost:5173/activities", wait_until="networkidle", timeout=10000), "04_activities")
        cards = await page.query_selector_all('[class*="card" i], [class*="activity" i]')
        R.append(f"   Activity elements: {len(cards)}")
        
        # 6. Click on an activity if possible
        async def click_activity():
            card = page.locator('[class*="card" i], [class*="activity" i]').first
            await card.click()
            await page.wait_for_timeout(2000)
        await step("Click activity card", click_activity, "05_activity_detail")
        
        # 7. Dashboard
        await step("Dashboard", lambda: page.goto("http://localhost:5173/dashboard", wait_until="networkidle", timeout=10000), "06_dashboard")
        
        # 8. Profile
        await step("Profile", lambda: page.goto("http://localhost:5173/profile", wait_until="networkidle", timeout=10000), "07_profile")
        
        # 9. Check accessibility toolbar
        async def check_a11y():
            toolbar = await page.query_selector('[class*="ccessib" i], [aria-label*="ccessib" i], button[class*="a11y" i]')
            if toolbar:
                await toolbar.click()
                await page.wait_for_timeout(1000)
                R.append("   Accessibility menu opened")
            else:
                # Try the red button in corner
                red_btn = page.locator('button').last
                await red_btn.click()
                await page.wait_for_timeout(1000)
        await step("Accessibility toolbar", check_a11y, "08_accessibility")
        
        # 10. Logout & login as staff
        await step("Go to auth", lambda: page.goto("http://localhost:5173/auth", wait_until="networkidle", timeout=10000), "09_auth_again")
        
        async def login_staff():
            await page.fill('input[type="email"], input[name="email"], input[placeholder*="mail" i]', "staff@minds.demo")
            await page.fill('input[type="password"], input[name="password"], input[placeholder*="assword" i]', "Demo2026!")
            await page.locator('button[type="submit"], button:has-text("Log In"), button:has-text("Sign In")').first.click()
            await page.wait_for_timeout(3000)
        await step("Login as staff", login_staff, "10_staff_home")
        R.append(f"   URL: {page.url}")
        
        # 11. Staff dashboard
        await step("Staff dashboard", lambda: page.goto("http://localhost:5173/dashboard", wait_until="networkidle", timeout=10000), "11_staff_dashboard")
        
        # 12. Logout & login as volunteer  
        await step("Auth page", lambda: page.goto("http://localhost:5173/auth", wait_until="networkidle", timeout=10000))
        
        async def login_volunteer():
            await page.fill('input[type="email"], input[name="email"], input[placeholder*="mail" i]', "volunteer@minds.demo")
            await page.fill('input[type="password"], input[name="password"], input[placeholder*="assword" i]', "Demo2026!")
            await page.locator('button[type="submit"], button:has-text("Log In"), button:has-text("Sign In")').first.click()
            await page.wait_for_timeout(3000)
        await step("Login as volunteer", login_volunteer, "12_volunteer_home")
        R.append(f"   URL: {page.url}")
        
        # 13. Swiper (volunteer matching)
        await step("Volunteer swiper", lambda: page.goto("http://localhost:5173/swiper", wait_until="networkidle", timeout=10000), "13_swiper")
        
        await browser.close()
        
        print("\n" + "="*60)
        print("MINDS ActivityHub — E2E Test Report")
        print("="*60)
        for r in R: print(r)
        print("="*60)
        shots = sorted(os.listdir(D))
        print(f"\nScreenshots ({len(shots)}):")
        for s in shots: print(f"  {s} ({os.path.getsize(f'{D}/{s}')//1024}KB)")

asyncio.run(run())
