import { useEffect, useRef } from 'react'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { setUser, logout } from './reducers/userReducer'

const App = () => {
	const dispatch = useDispatch()
	const user = useSelector((state) => state.user)
	const blogFormRef = useRef()

	useEffect(() => {
		dispatch(initializeBlogs())
	}, [])

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			dispatch(setUser(user))
		}
	}, [])

	/*
	const handleLogin = async (event) => {
		event.preventDefault()
		console.log('logging in with', username, password)

		try {
			const user = await loginService.login({
				username,
				password,
			})
			window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
			blogService.setToken(user.token)
			dispatch(displayNotification(`logged in ${user.name}`, 5))
			setUser(user)
			setUsername('')
			setPassword('')
		} catch (exception) {
			dispatch(displayNotification('wrong credentials', 5))
		}
	}
	*/

	const handleLogout = (event) => {
		event.preventDefault()
		console.log('logging out user', user.name)

		window.localStorage.clear()
		dispatch(logout())
	}
	/*
	const loginForm = () => (
		<form onSubmit={handleLogin}>
			<div>
				username
				<input
					type="text"
					value={username}
					name="Username"
					onChange={({ target }) => setUsername(target.value)}
					data-testid="username"
				/>
			</div>
			<div>
				password
				<input
					type="text"
					value={password}
					name="Password"
					onChange={({ target }) => setPassword(target.value)}
					data-testid="password"
				/>
			</div>
			<button type="submit">login</button>
		</form>
	)
	*/
	return (
		<div>
			<Notification />
			{user === null ? (
				<LoginForm />
			) : (
				<div>
					<h2>blogs</h2>
					<p>
						{user.name} logged in
						<button onClick={handleLogout}>logout</button>
					</p>

					<Togglable buttonLabel="new blog" ref={blogFormRef}>
						<BlogForm />
					</Togglable>
					<BlogList />
				</div>
			)}
		</div>
	)
}

export default App
