import { useEffect, useRef } from 'react'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import BlogView from './components/BlogView'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import UserList from './components/UserList'
import UserView from './components/UserView'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { setUser, logout } from './reducers/authReducer'
import { initializeUsers } from './reducers/usersReducer'
import { Routes, Route, Link, useMatch } from 'react-router-dom'

const App = () => {
	const dispatch = useDispatch()
	const currUser = useSelector((state) => state.authentication)
	const users = useSelector((state) => state.users)
	const blogs = useSelector((state) => state.blogs)
	const blogFormRef = useRef()
	const padding = {
		padding: 5,
	}

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

	const matchUser = useMatch('/users/:id')
	const user = matchUser
		? users.find((user) => user.id === matchUser.params.id)
		: null

	const matchBlog = useMatch('/blogs/:id')
	const blog = matchBlog
		? blogs.find((blog) => blog.id === matchBlog.params.id)
		: null

	const handleLogout = (event) => {
		event.preventDefault()
		console.log('logging out user', currUser.name)

		window.localStorage.clear()
		dispatch(logout())
	}

	return (
		<div>
			{currUser && (
				<div>
					<Link style={padding} to="/">
						blogs
					</Link>
					<Link style={padding} to="/users">
						users
					</Link>
					{currUser.name} logged in
					<button onClick={handleLogout}>logout</button>
				</div>
			)}
			<Notification />
			{currUser === null ? (
				<LoginForm />
			) : (
				<div>
					<h2>Blog app</h2>
					<Routes>
						<Route
							path="/"
							element={
								<div>
									<h2>Blogs</h2>
									<Togglable buttonLabel="new blog" ref={blogFormRef}>
										<BlogForm />
									</Togglable>
									<BlogList />
								</div>
							}
						/>
						<Route path="/users" element={<UserList />} />
						<Route path="/users/:id" element={<UserView user={user} />} />
						<Route path="/blogs/:id" element={<BlogView blog={blog} />} />
					</Routes>
				</div>
			)}
		</div>
	)
}

export default App
