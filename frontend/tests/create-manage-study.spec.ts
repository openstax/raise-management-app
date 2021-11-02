import { test, expect } from '@playwright/test'
import { TEST_SERVER_BASE_URL } from './utils'

test.describe.serial('studies can be created and managed', () => {
  test('researcher can create study', async ({ page }) => {
    await page.goto(TEST_SERVER_BASE_URL)
    await page.fill('#username', 'researcher')
    await page.fill('#password', 'researcher')
    await page.click('button')
    expect(page.url()).toMatch(`${TEST_SERVER_BASE_URL}/studies`)
    await page.waitForSelector('text=Studies')
    expect(await page.locator('text=There are no records to display').count()).toBe(1)
    await page.click('button[id="newstudy"]')
    expect(page.url()).toMatch(`${TEST_SERVER_BASE_URL}/studies/new`)
    await page.fill('#title', 'Researcher 1 study')
    await page.fill('#description', 'My study description')
    await page.fill('#qualtricsUrl', 'http://study.url')
    await page.fill('#qualtricsSecret', 'studysecret1')
    await page.click('text=Submit')
    expect(page.url()).toMatch(`${TEST_SERVER_BASE_URL}/studies`)
    await page.waitForSelector('text=Studies')
    expect(await page.locator('text=Researcher 1 study').count()).toBe(1)
  })
  test('admin can manage study', async ({ page }) => {
    await page.goto(TEST_SERVER_BASE_URL)
    await page.fill('#username', 'admin')
    await page.fill('#password', 'admin')
    await page.click('button')
    expect(page.url()).toMatch(`${TEST_SERVER_BASE_URL}/studies`)
    await page.waitForSelector('text=Studies')
    expect(await page.locator('text=SUBMITTED').count()).toBe(1)
    await Promise.all([
      page.click('text=Deny'),
      page.waitForResponse(response => response.url().includes('studies'))
    ])
    expect(await page.locator('text=SUBMITTED').count()).toBe(0)
    expect(await page.locator('text=DENIED').count()).toBe(1)
  })
})
