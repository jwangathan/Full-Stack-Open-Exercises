const loginWith = async (page, username, password)  => {
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
  }
  
  const createNote = async (page, title, author, url) => {
    await page.getByRole('button', { name: 'new blog' }).click()
    await page.getByTestId('title').fill(title)
    await page.getByTestId('author').fill(author)
    await page.getByTestId('url').fill(url)
    await page.getByRole('button', { name: 'create' }).click()
    await page.getByText(`${title} - ${author}`).waitFor()
  }

  const likeBlog = async (page, blog, numTimes) => {
    const blogtext = await page.getByText(blog)
    const blogElement = await blogtext.locator('..')
    await blogElement.getByRole('button', { name: 'view' }).click()
    for(var i = 0; i < numTimes; i++) {
      await blogElement.getByRole('button', { name: 'like' }).click()
    }
    await blogElement.getByRole('button', { name: 'hide' }).click()
  }
  
  export { loginWith, createNote, likeBlog }