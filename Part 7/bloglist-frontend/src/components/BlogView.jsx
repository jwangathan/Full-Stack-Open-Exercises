import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { likeBlog, deleteBlog, addComment } from '../reducers/blogReducer'
import { displayNotification } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'
import { Form, Button, ListGroup } from 'react-bootstrap'

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
		dispatch(
			displayNotification(`you liked '${changedBlog.title}'`, 'success', 5)
		)
	}

	const handleDelete = (blog) => {
		if (window.confirm(`Remove blog '${blog.title}' by ${blog.author}`)) {
			dispatch(deleteBlog(blog.id))
			dispatch(
				displayNotification(
					`'${blog.title}' Successfully deleted!`,
					'success',
					5
				)
			)
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
						<Button variant="primary" onClick={() => handleLike(blog)}>
							like
						</Button>
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
					<ListGroup>
						{blog.comments.map((comment) => (
							<ListGroup.Item variant="primary" key={comment._id}>
								{comment.content}
							</ListGroup.Item>
						))}
					</ListGroup>
					<Form onSubmit={newComment}>
						<Form.Control type="text" name="comment" />
						<Button variant="primary" type="submit">
							Add Comment
						</Button>
					</Form>
				</div>
			)}
		</div>
	)
}

export default BlogView
