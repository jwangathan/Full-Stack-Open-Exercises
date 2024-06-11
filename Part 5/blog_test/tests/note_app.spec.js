const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await page.pause()
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Jonathan Wang',
        username: 'jonathan_wang',
        password: 'password'
      }
    })
    
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('Log in to application')
    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
        await page.getByTestId('username').fill('jonathan_wang')
        await page.getByTestId('password').fill('password')
        await page.getByRole('button', { name: 'login' }).click()

        await expect(page.getByText('Jonathan Wang logged in')).toBeVisible()
    })
  
    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('jonathan_wang')
      await page.getByTestId('password').fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()

      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('wrong credentials')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('Jonathan Wang logged in')).not.toBeVisible()
    })
  })
})