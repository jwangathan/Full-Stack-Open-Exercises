import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { Routes, Route, Link } from 'react-router-dom'
import { useApolloClient, useSubscription } from '@apollo/client'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'
import { ALL_BOOKS, BOOK_ADDED } from './queries'

export const updateCache = (cache, query, addedBook) => {
	const uniqByName = (a) => {
		let seen = new Set()
		return a.filter((item) => {
			let k = item.title
			return seen.has(k) ? false : seen.add(k)
		})
	}

	cache.updateQuery(query, ({ allBooks }) => {
		return {
			allBooks: uniqByName(allBooks.concat(addedBook)),
		}
	})
}

const App = () => {
	const [token, setToken] = useState(null)
	const client = useApolloClient()

	useSubscription(BOOK_ADDED, {
		onData: ({ data }) => {
			const addedBook = data.data.bookAdded
			window.alert(`Added new book, ${addedBook.title}`)

			updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
		},
	})

	const logout = () => {
		setToken(null)
		localStorage.clear()
		client.resetStore()
	}

	return (
		<div>
			<div>
				<Link to="/">authors</Link>
				<Link to="/books">books</Link>
				{token ? (
					<>
						<Link to="/addBook">add book</Link>
						<Link to="/recommend">recommend</Link>
						<button onClick={logout}>logout</button>
					</>
				) : (
					<Link to="/login">login</Link>
				)}
			</div>

			<Routes>
				<Route path="/" element={<Authors token={token} />} />
				<Route path="/books" element={<Books />} />
				<Route path="/addBook" element={<NewBook />} />
				<Route path="/login" element={<LoginForm setToken={setToken} />} />
				<Route path="/recommend" element={<Recommendations />} />
			</Routes>
		</div>
	)
}

export default App
