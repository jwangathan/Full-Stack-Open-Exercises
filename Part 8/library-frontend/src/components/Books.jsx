import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { useState } from 'react'

const Books = () => {
	const [genreFilter, setGenreFilter] = useState('')
	const books = useQuery(ALL_BOOKS)

	if (books.loading) {
		return <div>loading books...</div>
	}

	const bookResult = genreFilter
		? books.data.allBooks.filter((b) => b.genres.includes(genreFilter))
		: books.data.allBooks

	const genres = [...new Set(books.data.allBooks.flatMap((b) => b.genres))]

	return (
		<div>
			<h2>books</h2>

			{genreFilter ? <p>in genre {genreFilter}</p> : <p>Showing all genres</p>}
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
