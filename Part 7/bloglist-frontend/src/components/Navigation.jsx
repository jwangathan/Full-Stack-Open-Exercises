import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../reducers/authReducer'
import { Nav, Navbar, Button } from 'react-bootstrap'

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
		<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
			<Navbar.Brand>Blog App</Navbar.Brand>
			<Navbar.Toggle aria-controls="responsive-navbar-nav" />
			<Navbar.Collapse id="responsive-navbar-nav">
				<Nav className="mr-auto">
					<Nav.Link href="#" as="span">
						<Link style={padding} to="/">
							blogs
						</Link>
					</Nav.Link>
					<Nav.Link href="#" as="span">
						<Link style={padding} to="/users">
							users
						</Link>
					</Nav.Link>
				</Nav>
				<Nav className="ms-auto">
					<Navbar.Text>{currUser.name} logged in</Navbar.Text>
					<Button variant="primary" onClick={handleLogout}>
						logout
					</Button>
				</Nav>
			</Navbar.Collapse>
		</Navbar>
	)
}

export default Navigation
