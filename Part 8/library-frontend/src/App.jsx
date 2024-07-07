import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { Routes, Route, Link } from 'react-router-dom'

const App = () => {
	return (
		<div>
			<div>
				<Link to="/">authors</Link>
				<Link to="/books">books</Link>
				<Link to="/addBook">add book</Link>
			</div>

			<Routes>
				<Route path="/" element={<Authors />} />
				<Route path="/books" element={<Books />} />
				<Route path="/addBook" element={<NewBook />} />
			</Routes>
		</div>
	)
}

export default App
