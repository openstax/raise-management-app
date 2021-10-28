import { test, expect } from '@playwright/test'

const TEST_SERVER_BASE_URL = 'http://localhost:3000'

test('signin redirects to studies on success', async ({ page }) => {
  await page.goto(TEST_SERVER_BASE_URL)
  await page.fill('#username', 'admin1')
  await page.fill('#password', 'admin1')
  await page.click('button')

  await expect(page.url()).toMatch(`${TEST_SERVER_BASE_URL}/studies`)
})
