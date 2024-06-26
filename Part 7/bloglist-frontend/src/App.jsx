import { useEffect, useRef } from 'react'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import UserList from './components/UserList'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { setUser, logout } from './reducers/authReducer'
import { initializeUsers } from './reducers/usersReducer'
import { Routes, Route } from 'react-router-dom'

const App = () => {
	const dispatch = useDispatch()
	const currUser = useSelector((state) => state.authentication)
	const blogFormRef = useRef()

	useEffect(() => {
		dispatch(initializeBlogs())
		dispatch(initializeUsers())
	}, [])

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			dispatch(setUser(user))
		}
	}, [])

	const handleLogout = (event) => {
		event.preventDefault()
		console.log('logging out user', currUser.name)

		window.localStorage.clear()
		dispatch(logout())
	}

	return (
		<div>
			<Notification />
			{currUser === null ? (
				<LoginForm />
			) : (
				<div>
					<h2>Blogs</h2>
					<p>
						{currUser.name} logged in
						<button onClick={handleLogout}>logout</button>
					</p>

					<Routes>
						<Route
							path="/"
							element={
								<div>
									<Togglable buttonLabel="new blog" ref={blogFormRef}>
										<BlogForm />
									</Togglable>
									<BlogList />
								</div>
							}
						/>
						<Route path="/users" element={<UserList />} />
					</Routes>
				</div>
			)}
		</div>
	)
}

export default App
