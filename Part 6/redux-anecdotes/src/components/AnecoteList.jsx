import { useDispatch, useSelector } from "react-redux";
import { vote } from '../reducers/anecdoteReducer'
import { setNotification, setEmpty } from "../reducers/notificationReducer";

const Anecdote = ({ anecdote, handleClick }) => {
	return (
		<div>
			<div>
				{anecdote.content}
			</div>
			<div>
				has {anecdote.votes}
				<button onClick={handleClick}>vote</button>
			</div>
		</div>
	)
}

const AnecdoteList = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(({ filter, anecdotes }) => {
		if ( filter === '' ) {
			return anecdotes
		}

    return anecdotes.filter(anecdote => anecdote.content.includes(filter))
	})

	const handleVote = (id, content) => {
		dispatch(vote(id))
		dispatch(setNotification(`you voted '${content}'`))
		setTimeout(() => {
			dispatch(setEmpty())
		}, 5000)
	}

    return (
			<div>
				{[...anecdotes].sort((a1, a2) => a2.votes - a1.votes).map(anecdote =>
					<Anecdote
						key={anecdote.id}
						anecdote={anecdote}
						handleClick={() => handleVote(anecdote.id, anecdote.content)}
					/>
				)}
			</div>
    )
}

export default AnecdoteList