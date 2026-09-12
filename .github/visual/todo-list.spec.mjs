import { expect, test } from '@playwright/test'

const screenshotDir = 'visual-results/screenshots'
const testUser = {
  email: 'visual-validation@example.com',
  name: 'Visual Validation',
  password: 'visual-validation-password',
  username: 'visualvalidation'
}

async function isVisible(locator) {
  return locator.isVisible().catch(() => false)
}

async function setTheme(page, theme) {
  await page.goto('/personalization', { waitUntil: 'networkidle' })
  const themeButton = page
    .locator('button')
    .filter({ has: page.locator(`img[alt="${theme}"]`) })

  await expect(themeButton).toHaveCount(1)
  await themeButton.click()
  if (theme === 'dark') {
    await expect(page.locator('body')).toHaveClass(/dark/)
  } else {
    await expect(page.locator('body')).not.toHaveClass(/dark/)
  }
}

test('captures the To-Do List layout in both themes', async ({ page }) => {
  page.on('console', message => {
    if (message.type() === 'error' || message.type() === 'warning') {
      console.log(`[visual browser ${message.type()}] ${message.text()}`)
    }
  })
  page.on('pageerror', error => {
    console.log(`[visual page error] ${error.message}`)
  })
  page.on('response', response => {
    if (response.status() >= 400) {
      console.log(
        `[visual host response] ${response.status()} ${response.request().method()} ${response.url()}`
      )
    }
  })
  page.on('requestfailed', request => {
    console.log(
      `[visual request failed] ${request.failure()?.errorText || 'unknown'} ${request.url()}`
    )
  })

  await page.goto('/auth', { waitUntil: 'networkidle' })

  // Wait for the page to settle and check what state we're in
  await page.waitForTimeout(2_000)

  // Check if we can see the login/create account form
  const emailInput = page.getByPlaceholder('johndoe@gmail.com')
  const loginFormVisible = await emailInput.isVisible().catch(() => false)

  if (!loginFormVisible) {
    // API is unavailable - capture the error state for debugging
    console.log('[visual] Login form not visible - API may be unavailable')
    await page.screenshot({
      fullPage: true,
      path: `${screenshotDir}/00-auth-error-state.png`
    })

    // Fail the test with a clear message about the API being unavailable
    throw new Error(
      'Visual walk failed: Login form is not visible. ' +
      'The API server may be unavailable or returning errors. ' +
      'Check the host response logs above for 4xx/5xx errors. ' +
      'Screenshot saved to 00-auth-error-state.png'
    )
  }

  const createAccountHeading = page.getByRole('heading', { name: 'Welcome!' })
  if (await isVisible(createAccountHeading)) {
    await page.getByPlaceholder('johndoe@gmail.com').fill(testUser.email)
    await page.getByPlaceholder('johndoe', { exact: true }).fill(testUser.username)
    await page.getByPlaceholder('John Doe').fill(testUser.name)
    await page.getByPlaceholder('Enter your password', { exact: true }).fill(testUser.password)
    await page
      .getByPlaceholder('Re-enter your password')
      .fill(testUser.password)
    await page.getByRole('button', { name: 'Proceed' }).click()
    await page.waitForTimeout(1_500)
    await page.reload({ waitUntil: 'networkidle' })
  }

  await page.getByPlaceholder('johndoe@gmail.com').fill(testUser.email)
  await page.getByPlaceholder('••••••••••••••••').fill(testUser.password)
  await page.getByRole('button', { name: 'Sign In' }).click()
  await page.waitForURL(/\/dashboard/, { waitUntil: 'networkidle' })

  await setTheme(page, 'dark')
  await page.goto('/todo-list', { waitUntil: 'networkidle' })
  await expect(page.getByRole('heading', { name: /All Tasks/ })).toBeVisible()

  const taskSummary = `Visual validation task ${Date.now()}`
  await page.getByRole('button', { name: /New Task/ }).click()
  await expect(page.getByText('Include Time')).toBeVisible()
  await page.getByPlaceholder('An urgent task').fill(taskSummary)
  await page.getByRole('button', { name: 'Create' }).click()
  await expect(page.getByText(taskSummary)).toBeVisible()

  await page.screenshot({
    fullPage: true,
    path: `${screenshotDir}/01-task-list-dark.png`
  })
  await page
    .locator('aside')
    .nth(1)
    .screenshot({
      path: `${screenshotDir}/02-sidebar-dark.png`
    })

  await page.getByRole('button', { name: `Edit ${taskSummary}` }).click()
  await expect(page.getByText('Include Time')).toBeVisible()
  await page.screenshot({
    fullPage: true,
    path: `${screenshotDir}/05-task-edit-drawer-dark.png`
  })

  await setTheme(page, 'light')
  await page.goto('/todo-list', { waitUntil: 'networkidle' })
  await expect(page.getByText(taskSummary)).toBeVisible()
  await page.screenshot({
    fullPage: true,
    path: `${screenshotDir}/03-task-list-light.png`
  })
  await page
    .locator('aside')
    .nth(1)
    .screenshot({
      path: `${screenshotDir}/04-sidebar-light.png`
    })

  await page.getByRole('button', { name: `Edit ${taskSummary}` }).click()
  await expect(page.getByText('Include Time')).toBeVisible()
  await page.screenshot({
    fullPage: true,
    path: `${screenshotDir}/06-task-edit-drawer-light.png`
  })
})
