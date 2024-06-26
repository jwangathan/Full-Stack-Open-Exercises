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
import { initializeBlogs, deleteBlog, updateBlog } from './reducers/blogReducer'
import { displayNotification } from './reducers/notificationReducer'
import { setUser, logout } from './reducers/authReducer'
import { initializeUsers } from './reducers/usersReducer'
import { Routes, Route, useMatch } from 'react-router-dom'

const App = () => {
	const dispatch = useDispatch()
	const currUser = useSelector((state) => state.authentication)
	const users = useSelector((state) => state.users)
	const blogs = useSelector((state) => state.blogs)
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

	const handleLike = (blog) => {
		const changedBlog = {
			...blog,
			likes: blog.likes + 1,
		}
		dispatch(updateBlog(changedBlog))
		dispatch(displayNotification(`you liked '${changedBlog.title}'`, 5))
	}

	const handleDelete = (blog) => {
		if (window.confirm(`Remove blog '${blog.title}' by ${blog.author}`)) {
			dispatch(deleteBlog(blog.id))
			dispatch(displayNotification(`'${blog.title}' Successfully deleted!`, 5))
		}
	}

	return (
		<div>
			<Notification />
			{currUser === null ? (
				<LoginForm />
			) : (
				<div>
					<h2>Blogs</h2>
					<p>{currUser.name} logged in </p>
					<button onClick={handleLogout}>logout</button>

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
						<Route path="/users/:id" element={<UserView user={user} />} />
						<Route
							path="/blogs/:id"
							element={
								<BlogView
									blog={blog}
									updateLike={handleLike}
									removeBlog={handleDelete}
								/>
							}
						/>
					</Routes>
				</div>
			)}
		</div>
	)
}

export default App
