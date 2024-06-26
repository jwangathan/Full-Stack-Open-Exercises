import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './reducers/notificationReducer'
import blogReducer from './reducers/blogReducer'
import authReducer from './reducers/authReducer'
import usersReducer from './reducers/usersReducer'

export const store = configureStore({
	reducer: {
		blogs: blogReducer,
		authentication: authReducer,
		notification: notificationReducer,
		users: usersReducer,
	},
})
