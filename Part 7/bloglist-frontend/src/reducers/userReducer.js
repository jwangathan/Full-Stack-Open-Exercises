import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { displayNotification } from './notificationReducer'

const userSlice = createSlice({
	name: 'user',
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
				dispatch(displayNotification(`logged in ${user.name}`, 5))
			})
			.catch(() => {
				dispatch(displayNotification('wrong credentials', 5))
			})
	}
}

export const { setUser, logout } = userSlice.actions
export default userSlice.reducer
