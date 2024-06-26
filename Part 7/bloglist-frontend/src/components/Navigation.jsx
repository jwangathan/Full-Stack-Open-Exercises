import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'

const Navigation = () => {
	const currUser = useSelector((state) => state.authentication)
	const dispatch = useDispatch()
	const padding = {
		padding: 5,
	}

	const handleLogout = (event) => {
		event.preventDefault()
		console.log('logging out user', currUser.name)

		window.localStorage.clear()
		dispatch(logout())
	}

	return (
		<div>
			<Link style={padding} to="/">
				blogs
			</Link>
			<Link style={padding} to="/users">
				users
			</Link>
			{currUser.name} logged in
			<button onClick={handleLogout}>logout</button>
		</div>
	)
}

export default Navigation
