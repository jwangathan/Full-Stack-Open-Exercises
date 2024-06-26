import { useSelector } from 'react-redux'

const UserView = ({ user }) => {
	const blogs = useSelector((state) => state.blogs)

	return (
		<div>
			{user && (
				<div>
					<h2>{user.name}</h2>
					<h3>Added blogs</h3>
					{blogs
						.filter((blog) => blog.user.id === user.id)
						.map((blog) => (
							<li key={blog.id}>{blog.title}</li>
						))}
				</div>
			)}
		</div>
	)
}

export default UserView
