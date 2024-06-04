import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect, test } from 'vitest'

test('5.13 renders title and name by default, but not URL or likes', () => {
    const blog = {
        title: 'Title',
        author: 'Jonathan Wang',
        url: 'website.com'
    }

    render(<Blog blog={blog} />)

    const element = screen.getByText('Title Jonathan Wang')
    const url = screen.queryByText('website.com')
    expect(element).toBeDefined()
    expect(url).toBeNull()
})

test('5.14 clicks the view button, and renders the URL and likes', async () => {
    const blog = {
        title: 'Title',
        author: 'Jonathan Wang',
        url: 'website.com',
        user: { name: 'Jonathan Wang' }
    }

    const { container } = render(<Blog blog={blog} user={{username: 'jonathan_wang'}}/>)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
    const element = container.querySelector('.viewContent')
    expect(element).toHaveTextContent('website.com')
    expect(element).toHaveTextContent('like')
})