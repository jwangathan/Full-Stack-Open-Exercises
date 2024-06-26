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
import { setUser } from './reducers/authReducer'
import { initializeUsers } from './reducers/usersReducer'
import { Routes, Route, Link, useMatch } from 'react-router-dom'
import Navigation from './components/Navigation'

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

	return (
		<div>
			{currUser && <Navigation />}
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
