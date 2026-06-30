import { expect, test } from '@playwright/test'

const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
] as const

for (const viewport of viewports) {
  test(`button story renders on ${viewport.name}`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport)
    await page.goto('/iframe.html?id=foolscap-button--variants&viewMode=story')
    await expect(page.getByRole('button', { name: 'Primary' })).toBeVisible()
    await page.screenshot({
      fullPage: true,
      path: testInfo.outputPath(`button-variants-${viewport.name}.png`),
    })
  })
}
