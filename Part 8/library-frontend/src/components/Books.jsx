import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { useState } from 'react'

const Books = () => {
	const [genreFilter, setGenreFilter] = useState('')
	const books = useQuery(ALL_BOOKS, { variables: { genre: genreFilter } })
	const allBooks = useQuery(ALL_BOOKS)

	if (books.loading || allBooks.loading) {
		return <div>loading books...</div>
	}

	const bookResult = books.data.allBooks

	const genres = [...new Set(allBooks.data.allBooks.flatMap((b) => b.genres))]

	return (
		<div>
			<h2>books</h2>

			{genreFilter ? (
				<p>
					in genre <strong>{genreFilter}</strong>
				</p>
			) : (
				<p>Showing all genres</p>
			)}
			<table>
				<tbody>
					<tr>
						<th></th>
						<th>author</th>
						<th>published</th>
					</tr>
					{bookResult.map((a) => (
						<tr key={a.title}>
							<td>{a.title}</td>
							<td>{a.author.name}</td>
							<td>{a.published}</td>
						</tr>
					))}
				</tbody>
			</table>
			{genres.map((g) => (
				<button key={g} onClick={() => setGenreFilter(g)}>
					{g}
				</button>
			))}
			<button onClick={() => setGenreFilter('')}>all genres</button>
		</div>
	)
}

export default Books
