import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { displayNotification } from './notificationReducer'

const authSlice = createSlice({
	name: 'authentication',
	initialState: null,
	reducers: {
		setUser(state, action) {
			window.localStorage.setItem(
				'loggedBlogappUser',
				JSON.stringify(action.payload)
			)
			blogService.setToken(action.payload.token)
			return action.payload
		},
		logout(state, action) {
			return null
		},
	},
})

export const loginUser = (username, password) => {
	return async (dispatch) => {
		await loginService
			.login({ username, password })
			.then((user) => {
				dispatch(setUser(user))
				dispatch(displayNotification(`logged in ${user.name}`, 'success', 5))
			})
			.catch(() => {
				dispatch(displayNotification('wrong credentials', 'danger', 5))
			})
	}
}

export const { setUser, logout } = authSlice.actions
export default authSlice.reducer
