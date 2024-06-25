import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { displayNotification } from './notificationReducer'

const blogSlice = createSlice({
	name: 'blogs',
	initialState: [],
	reducers: {
		like(state, action) {
			const id = action.payload
			const blogToChange = state.find((b) => b.id === id)
			const changedBlog = {
				...blogToChange,
				likes: blogToChange.likes + 1,
			}
			return state.map((blog) => (blog.id !== id ? blog : changedBlog))
		},
		removeBlog(state, action) {
			const id = action.payload
			const newBlogList = state.filter((b) => b.id !== id)
			return newBlogList
		},
		appendBlog(state, action) {
			state.push(action.payload)
		},
		setBlogs(state, action) {
			return action.payload
		},
	},
})

export const initializeBlogs = () => {
	return async (dispatch) => {
		const blogs = await blogService.getAll()
		dispatch(setBlogs(blogs))
	}
}

export const createBlog = (title, author, url) => {
	return async (dispatch) => {
		const object = { title, author, url }
		blogService
			.create(object)
			.then((res) => {
				dispatch(appendBlog(res))
				dispatch(
					displayNotification(`A new blog '${title}' by ${author} added`, 5)
				)
			})
			.catch(() => {
				dispatch(displayNotification('incorrect/missing title or author', 5))
			})
	}
}

export const updateBlog = (changedBlog) => {
	return async (dispatch) => {
		const newBlog = await blogService.update(changedBlog.id, changedBlog)
		dispatch(like(newBlog.id))
	}
}

export const deleteBlog = (id) => {
	return async (dispatch) => {
		await blogService.remove(id).catch(() => {
			dispatch(displayNotification(`Error deleting blog '${blog.title}'`, 5))
		})
		dispatch(removeBlog(id))
	}
}

export const { appendBlog, setBlogs, like, removeBlog } = blogSlice.actions
export default blogSlice.reducer
