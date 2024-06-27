import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import { Form, Button } from 'react-bootstrap'

const BlogForm = () => {
	const dispatch = useDispatch()

	const addBlog = (event) => {
		event.preventDefault()
		const title = event.target.title.value
		const author = event.target.author.value
		const url = event.target.url.value
		event.target.title.value = ''
		event.target.author.value = ''
		event.target.url.value = ''
		dispatch(createBlog(title, author, url))
	}

	return (
		<div className="formDiv">
			<h2>create new</h2>
			<Form onSubmit={addBlog}>
				<Form.Group>
					<Form.Label>Title: </Form.Label>
					<Form.Control
						type="text"
						name="title"
						placeholder="write title here"
						data-testid="title"
					/>
				</Form.Group>
				<Form.Group>
					<Form.Label>Author: </Form.Label>
					<Form.Control
						type="text"
						name="author"
						placeholder="write author here"
						data-testid="author"
					/>
				</Form.Group>
				<Form.Group>
					<Form.Label>URL: </Form.Label>
					<Form.Control
						type="text"
						name="url"
						placeholder="write url here"
						data-testid="url"
					/>
				</Form.Group>
				<Button variant="primary" type="submit">
					create
				</Button>
			</Form>
		</div>
	)
}

export default BlogForm
