import { useDispatch } from 'react-redux'
import { loginUser } from '../reducers/authReducer'
import { Form, Button } from 'react-bootstrap'

const LoginForm = () => {
	const dispatch = useDispatch()

	const handleLogin = (event) => {
		event.preventDefault()
		const username = event.target.username.value
		const password = event.target.password.value
		event.target.username.value = ''
		event.target.password.value = ''
		console.log('logging in with', username, password)
		dispatch(loginUser(username, password))
	}

	return (
		<div>
			<h2>Log in to application</h2>
			<Form onSubmit={handleLogin}>
				<Form.Group>
					<Form.Label>username:</Form.Label>
					<Form.Control type="text" name="username" data-testid="username" />
				</Form.Group>
				<Form.Group>
					<Form.Label>password:</Form.Label>
					<Form.Control type="text" name="password" data-testid="password" />
				</Form.Group>
				<Button variant="primary" type="submit">
					login
				</Button>
			</Form>
		</div>
	)
}

export default LoginForm
