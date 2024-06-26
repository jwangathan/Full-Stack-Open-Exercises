import { useDispatch } from 'react-redux'
import { loginUser } from '../reducers/authReducer'

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
			<form onSubmit={handleLogin}>
				<div>
					username
					<input type="text" name="username" data-testid="username" />
				</div>
				<div>
					password
					<input type="text" name="password" data-testid="password" />
				</div>
				<button type="submit">login</button>
			</form>
		</div>
	)
}

export default LoginForm
