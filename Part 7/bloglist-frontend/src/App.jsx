import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import { useDispatch } from 'react-redux'
import { displayNotification } from './reducers/notificationReducer'

const App = () => {
	const [blogs, setBlogs] = useState([])
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [user, setUser] = useState(null)
	const dispatch = useDispatch()

	const blogFormRef = useRef()

	useEffect(() => {
		blogService.getAll().then((initialBlogs) => setBlogs(initialBlogs))
	}, [])

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			setUser(user)
			blogService.setToken(user.token)
		}
	}, [])

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

	const handleLogout = async (event) => {
		event.preventDefault()
		console.log('logging out user', user.name)

		window.localStorage.clear()
		setUser(null)
	}

	const increaseLikeOf = async (blog) => {
		const updatedBlog = await blogService.update(blog.id, {
			...blog,
			likes: blog.likes + 1,
		})
		setBlogs(blogs.map((b) => (b.id !== blog.id ? b : updatedBlog)))
	}

	const deleteBlog = async (blog) => {
		if (window.confirm(`Remove blog '${blog.title}' by ${blog.author}`)) {
			try {
				await blogService.remove(blog.id)
				setBlogs(blogs.filter((b) => b.id !== blog.id))
				dispatch(displayNotification('Successfully deleted!', 5))
			} catch (error) {
				dispatch(displayNotification(`Error deleting blog '${blog.title}'`, 5))
			}
		}
	}

	const addBlog = (blogObject) => {
		blogFormRef.current.toggleVisibility()
		blogService
			.create(blogObject)
			.then((returnedBlog) => {
				dispatch(
					displayNotification(
						`A new blog '${blogObject.title}' by ${blogObject.author} added`,
						5
					)
				)
				setBlogs(blogs.concat(returnedBlog))
			})
			.catch((error) => {
				dispatch(displayNotification('incorrect/missing title or author', 5))
			})
	}

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
	return (
		<div>
			<Notification />
			{user === null ? (
				<div>
					<h2>Log in to application</h2>
					{loginForm()}
				</div>
			) : (
				<div>
					<h2>blogs</h2>
					<p>
						{user.name} logged in
						<button onClick={handleLogout}>logout</button>
					</p>

					<Togglable buttonLabel="new blog" ref={blogFormRef}>
						<BlogForm createBlog={addBlog} />
					</Togglable>

					{blogs
						.sort((blog1, blog2) => blog2.likes - blog1.likes)
						.map((blog) => (
							<Blog
								key={blog.id}
								blog={blog}
								updateLike={() => increaseLikeOf(blog)}
								removeBlog={() => deleteBlog(blog)}
								user={user}
							/>
						))}
				</div>
			)}
		</div>
	)
}

export default App
