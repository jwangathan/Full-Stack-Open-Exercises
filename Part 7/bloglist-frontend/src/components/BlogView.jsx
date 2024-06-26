import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const BlogView = ({ blog, updateLike, removeBlog }) => {
	const currUser = useSelector((state) => state.authentication)
	const navigate = useNavigate()
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
						<button onClick={() => updateLike(blog)}>like</button>
					</p>
					<p>Added by {blog.user.name}</p>
					{currUser.username === blog.user.username && (
						<button
							onClick={() => {
								removeBlog(blog)
								navigate('/')
							}}
						>
							remove
						</button>
					)}
				</div>
			)}
		</div>
	)
}

export default BlogView
