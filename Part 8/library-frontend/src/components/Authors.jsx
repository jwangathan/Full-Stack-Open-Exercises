import { useMutation, useQuery } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'
import { useState } from 'react'

const Authors = () => {
	const [name, setName] = useState('')
	const [born, setBorn] = useState('')
	const authors = useQuery(ALL_AUTHORS)
	const [editAuthor] = useMutation(EDIT_AUTHOR, {
		refetchQueries: [{ query: ALL_AUTHORS }],
	})

	if (authors.loading) {
		return <div>loading authors...</div>
	}

	const submit = (event) => {
		event.preventDefault()

		editAuthor({ variables: { name, setBornTo: parseInt(born) } })

		setName('')
		setBorn('')
	}

	return (
		<div>
			<h2>authors</h2>
			<table>
				<tbody>
					<tr>
						<th></th>
						<th>born</th>
						<th>books</th>
					</tr>
					{authors.data.allAuthors.map((a) => (
						<tr key={a.name}>
							<td>{a.name}</td>
							<td>{a.born}</td>
							<td>{a.bookCount}</td>
						</tr>
					))}
				</tbody>
			</table>
			<h2>Set birthyear</h2>
			<form onSubmit={submit}>
				<div>
					name{' '}
					<input
						value={name}
						onChange={({ target }) => setName(target.value)}
					/>
				</div>
				<div>
					born{' '}
					<input
						value={born}
						onChange={({ target }) => setBorn(target.value)}
					/>
				</div>
				<button type="submit">update author</button>
			</form>
		</div>
	)
}

export default Authors
