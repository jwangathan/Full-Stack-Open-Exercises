import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { likeBlog, deleteBlog, addComment } from '../reducers/blogReducer'
import { displayNotification } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'

const BlogView = ({ blog }) => {
	const dispatch = useDispatch()
	const currUser = useSelector((state) => state.authentication)
	const navigate = useNavigate()

	const handleLike = (blog) => {
		const changedBlog = {
			...blog,
			likes: blog.likes + 1,
		}
		dispatch(likeBlog(changedBlog))
		dispatch(displayNotification(`you liked '${changedBlog.title}'`, 5))
	}

	const handleDelete = (blog) => {
		if (window.confirm(`Remove blog '${blog.title}' by ${blog.author}`)) {
			dispatch(deleteBlog(blog.id))
			dispatch(displayNotification(`'${blog.title}' Successfully deleted!`, 5))
		}
	}

	const newComment = (event) => {
		event.preventDefault()
		const content = event.target.comment.value
		event.target.comment.value = ''
		dispatch(addComment(blog.id, content))
	}

	return (
		<div>
			{blog && (
				<div className="viewContent">
					<h2>
						{blog.title} - {blog.author}
					</h2>
					<a href={`//${blog.url}`} target="_blank">
						{blog.url}
					</a>
					<p>
						likes: {blog.likes}{' '}
						<button onClick={() => handleLike(blog)}>like</button>
					</p>
					<p>Added by {blog.user.name}</p>
					{currUser.username === blog.user.username && (
						<button
							onClick={() => {
								handleDelete(blog)
								navigate('/')
							}}
						>
							remove
						</button>
					)}
					<h3>Comments</h3>
					<form onSubmit={newComment}>
						<input type="text" name="comment" />
						<button type="submit">Add Comment</button>
					</form>
					{blog.comments.map((comment) => (
						<li key={comment._id}> {comment.content} </li>
					))}
				</div>
			)}
		</div>
	)
}

export default BlogView
