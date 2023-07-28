import { useState } from 'react'

const Button = (props) => ( <button onClick={props.handleClick}> {props.name} </button> )

const Header = ({ name }) => ( <h1> {name} </h1> )

const StatisticLine = ({ name, value }) => {
  if(name === "positive") {
    return ( <p>{name} {value} %</p> )
  }

  return( <p>{name} {value}</p> )
}

const Statistics = ({ good, neutral, bad}) => {
  if (good === 0 && neutral === 0 && bad === 0) {
    return ( <p>No feedback given</p> )
  }
  let sum = good + neutral + bad
  let average = (good - bad) / sum
  let positive = ((good) / sum) * 100
  return (
    <div>
      <StatisticLine name="good" value={good} />
      <StatisticLine name="neutral" value={neutral} />
      <StatisticLine name="bad" value={bad} />
      <StatisticLine name="all" value={sum} />
      <StatisticLine name="average" value={average} />
      <StatisticLine name="positive" value={positive} />
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Header name="give feedback" />
      <Button handleClick={()=>setGood(good+1)} name="good" />
      <Button handleClick={()=>setNeutral(neutral+1)} name="neutral" />
      <Button handleClick={()=>setBad(bad+1)} name="bad" />
      <Header name="statistics" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App