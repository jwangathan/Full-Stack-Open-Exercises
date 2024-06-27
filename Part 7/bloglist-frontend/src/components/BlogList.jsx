import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'

const Blog = ({ blog }) => {
	return (
		<tr>
			<td>
				<Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
			</td>
			<td>{blog.author}</td>
		</tr>
	)
}

const BlogList = () => {
	const blogs = useSelector((state) => state.blogs)

	return (
		<div>
			<Table striped>
				<thead>
					<tr>
						<th>Title</th>
						<th>Author</th>
					</tr>
				</thead>
				<tbody>
					{[...blogs]
						.sort((b1, b2) => b2.likes - b1.likes)
						.map((blog) => (
							<Blog key={blog.id} blog={blog} />
						))}
				</tbody>
			</Table>
		</div>
	)
}

export default BlogList
