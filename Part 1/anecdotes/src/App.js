import { useState } from 'react'

const Button = (props) => {
  return (
    <div>
      <button onClick={props.handleClick}> {props.name} </button>
    </div>
  )
}

const Heading = ({ text }) => (<h1> {text} </h1>)

const Most = ({ anecdotes, votes }) => {
  let index = votes.indexOf(Math.max(...votes))
  return (
    <div>
      {anecdotes[index]}
      <p>has {votes[index]} votes</p>
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const temp = new Uint8Array(anecdotes.length)
  const [votes, setVotes] = useState(temp)

  const generate = () => {
    let num = Math.floor(Math.random() * anecdotes.length)
    console.log(num)
    return num
  }

  const updateVotes = (index) => {
    console.log(index)
    const copy = [...votes]
    copy[index] += 1
    setVotes(copy)
  }

  return (
    <div>
      <Heading text="Anecdote of the day" />
      {anecdotes[selected]}
      <p>has {votes[selected]} votes</p>
      <Button handleClick={()=>updateVotes(selected)} name="vote"/>
      <Button handleClick={()=>setSelected(generate())} name="next anecdote" />
      <Heading text="Anecdote with the most votes" />
      <Most anecdotes={anecdotes} votes={votes} />
    </div>
  )
}

export default App