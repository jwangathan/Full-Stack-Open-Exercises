const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createNote } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
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
      await loginWith(page, 'jonathan_wang', 'password')

      await expect(page.getByText('Jonathan Wang logged in')).toBeVisible()
    })
  
    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'jonathan_wang', 'wrong')

      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('wrong credentials')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('Jonathan Wang logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'jonathan_wang', 'password')
    })

    test('a new blog can be created', async ({ page }) => {
      await createNote(page, 'a title', 'an author', 'url.com')
      await expect(page.getByText('a title - an author')).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createNote(page, 'title 1', 'author 1', 'url1.com')
        await createNote(page, 'title 2', 'author 2', 'url2.com')
      })

      test('a blog can be liked', async ({ page }) => {
        const blogText = await page.getByText('title 2 - author 2')
        const blogElement = await blogText.locator('..')

        await blogElement.getByRole('button', { name: 'view' }).click()

        await blogElement.getByRole('button', { name: 'like' }).click()
        await expect(blogElement.locator('.viewContent').getByText('likes: 1')).toBeVisible()
      })

      test('a blog can be deleted', async ({ page }) => {
        page.on('dialog', async dialog => {
          expect(dialog.type()).toContain('confirm')
          expect(dialog.message()).toContain('Remove blog \'title 2\' by author 2')
          await dialog.accept()
        })
        const blogText = await page.getByText('title 2 - author 2')
        const blogElement = await blogText.locator('..')
        await blogElement.getByRole('button', { name: 'view' }).click()
        await blogElement.getByRole('button', { name: 'remove' }).click()

        await expect(page.getByText('title 2 - author 2')).not.toBeVisible()
      })

      test('a blog cannot be deleted by another user', async ({ page, request }) => {
        await request.post('/api/users', {
          data: {
            name: 'Lindsey Chheng',
            username: 'lindsey_chheng',
            password: 'australia'
          }
        })

        const blogText = await page.getByText('title 2 - author 2')
        const blogElement = await blogText.locator('..')
        await blogElement.getByRole('button', { name: 'view' }).click()
        await expect(blogElement.getByText('remove')).toBeVisible()

        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'lindsey_chheng', 'australia')
        await blogElement.getByRole('button', { name: 'view' }).click()
        await expect(blogElement.getByText('remove')).not.toBeVisible()

      })
    })
  })
})