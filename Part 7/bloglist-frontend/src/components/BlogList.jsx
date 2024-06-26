import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {
	const blogStyle = {
		paddingTop: 10,
		paddingLeft: 2,
		border: 'solid',
		borderWidth: 1,
		marginBottom: 5,
	}

	return (
		<div style={blogStyle} className="blog">
			<Link to={`/blogs/${blog.id}`}>
				{blog.title} - {blog.author}
			</Link>
		</div>
	)
}

const BlogList = () => {
	const dispatch = useDispatch()
	const blogs = useSelector((state) => state.blogs)

	return (
		<div>
			{[...blogs]
				.sort((b1, b2) => b2.likes - b1.likes)
				.map((blog) => (
					<Blog key={blog.id} blog={blog} />
				))}
		</div>
	)
}

export default BlogList
