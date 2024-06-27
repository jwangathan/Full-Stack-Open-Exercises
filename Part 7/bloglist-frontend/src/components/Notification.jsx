import { useSelector } from 'react-redux'
import { Alert } from 'react-bootstrap'

const Notification = () => {
	const notification = useSelector((state) => state.notification)
	return (
		<div>
			{notification && (
				<Alert variant={notification.type}>{notification.message}</Alert>
			)}
		</div>
	)
}

export default Notification
