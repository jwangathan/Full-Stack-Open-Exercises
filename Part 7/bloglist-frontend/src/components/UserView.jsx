import { useSelector } from 'react-redux'
import { ListGroup } from 'react-bootstrap'

const UserView = ({ user }) => {
	const blogs = useSelector((state) => state.blogs)

	return (
		<div>
			{user && (
				<div>
					<h2>{user.name}</h2>
					<h3>Added blogs</h3>
					<ListGroup>
						{blogs
							.filter((blog) => blog.user.id === user.id)
							.map((blog) => (
								<ListGroup.Item key={blog.id}>{blog.title}</ListGroup.Item>
							))}
					</ListGroup>
				</div>
			)}
		</div>
	)
}

export default UserView
