import { render, screen } from '@testing-library/react'
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
    const author = screen.queryByText('Jonathan Wang')
    const url = screen.queryByText('website.com')
    expect(element).toBeDefined()
    expect(author).toBeNull()
    expect(url).toBeNull()
})