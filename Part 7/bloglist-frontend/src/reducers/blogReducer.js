import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { displayNotification } from './notificationReducer'

const blogSlice = createSlice({
	name: 'blogs',
	initialState: [],
	reducers: {
		updateBlog(state, action) {
			const id = action.payload.id
			const changedBlog = action.payload
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
		blogService
			.create({ title, author, url })
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

export const likeBlog = (changedBlog) => {
	return async (dispatch) => {
		const newBlog = await blogService.like(changedBlog.id, changedBlog)
		dispatch(updateBlog(newBlog))
	}
}

export const addComment = (id, content) => {
	return async (dispatch) => {
		await blogService
			.comment(id, { content: content })
			.then((res) => {
				dispatch(updateBlog(res))
				dispatch(displayNotification('Comment added!', 5))
			})
			.catch(() => {
				dispatch(displayNotification('Error with adding comment', 5))
			})
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

export const { appendBlog, setBlogs, updateBlog, removeBlog } =
	blogSlice.actions
export default blogSlice.reducer
