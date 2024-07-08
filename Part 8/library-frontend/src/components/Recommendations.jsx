import { useQuery } from '@apollo/client'
import { ME, ALL_BOOKS } from '../queries'

const Recommendations = () => {
	const books = useQuery(ALL_BOOKS)
	const user = useQuery(ME, {
		skip: !localStorage.getItem('library-user-token'),
	})

	if (books.loading || user.loading) {
		return <div>loading...</div>
	}

	const genre = user.data.me.favoriteGenre

	const bookResult = books.data.allBooks.filter((b) => b.genres.includes(genre))
	return (
		<div>
			<h2>recommendations</h2>
			<p>
				books in your favorite genre: <strong>{genre}</strong>
			</p>
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
		</div>
	)
}

export default Recommendations
