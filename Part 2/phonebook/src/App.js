import { useState, useEffect } from 'react'

import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'

import personService from './services/persons'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [filter, setFilter] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [addMessage, setAddMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    if(persons.some((element) => element.name === newName)) {
      const person = persons.find(p => p.name === newName)
      const changedPerson =  { ...person, number: newNumber}
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personService
          .update(person.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
          })
          .catch(error => {
            console.log("ERROR ERROR")
            setErrorMessage(`Information of ${newName} has already been removed from the server`)
            setPersons(persons.filter(p => p.id !== person.id))
          })
      }
    } else {
      const newPerson = { name: newName, number: newNumber }
      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
    }
    setAddMessage(`Added ${newName}`)
  }

  const deletePerson = person => {
    if(window.confirm(`Delete ${person.name}?`)) {
      axios
      .delete(`http://localhost:3001/persons/${person.id}`)
      .then(response => {
        setPersons(persons.filter(p => p.id !== person.id))
      })
    }
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    if(event.target.value === '') {
      setShowAll(true)
    } else {
      setShowAll(false)
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification addMessage={addMessage} errorMessage={errorMessage}/>
      <Filter filter={filter} change={handleFilterChange}/>
      <h2>Add a new</h2>
      <PersonForm 
      addPerson={addPerson} newName={newName} newNumber={newNumber} 
      handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} 
      />
      <h2>Numbers</h2>
      <Persons filter={filter} showAll={showAll} persons={persons} deletePerson={deletePerson}/>
    </div>
  )
}

export default App