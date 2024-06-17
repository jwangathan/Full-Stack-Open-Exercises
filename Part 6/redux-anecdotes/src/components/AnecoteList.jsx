import { useDispatch, useSelector } from "react-redux";
import { vote } from '../reducers/anecdoteReducer'

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

    return (
			<div>
				{[...anecdotes].sort((a1, a2) => a2.votes - a1.votes).map(anecdote =>
					<Anecdote
						key={anecdote.id}
						anecdote={anecdote}
						handleClick={() => dispatch(vote(anecdote.id))}
					/>
				)}
			</div>
    )
}

export default AnecdoteList