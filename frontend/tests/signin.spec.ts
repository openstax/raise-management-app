import { test, expect } from '@playwright/test'
import { TEST_SERVER_BASE_URL } from './utils'

test('signin redirects to studies on success', async ({ page }) => {
  await page.goto(TEST_SERVER_BASE_URL)
  await page.fill('#username', 'admin1')
  await page.fill('#password', 'admin1')
  await page.click('button')

  expect(page.url()).toMatch(`${TEST_SERVER_BASE_URL}/studies`)
})
