import { useState, useEffect } from 'react'

import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'

import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [filter, setFilter] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [info, setInfo] = useState({ message: null })
  
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const notifyWith = (message, type='info') => {
    setInfo({
      message, type
    })

    setTimeout(() => {
      setInfo({message: null})
    }, 3000)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const person = persons.find(p => p.name === newName)
    if(person) {
      updatePerson(person)
      return
    }
    const newPerson = { name: newName, number: newNumber }
    personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        notifyWith(`${returnedPerson.name} added!`)
      })
      .catch(error => {
        console.log(error.response.data.error)
        notifyWith(error.response.data.error, 'error')
      })
  }

  const updatePerson = (person) => {
    if(window.confirm(`${newName} is already added to phonebook, replace the number?`)) {
      personService
        .update(person.id, {...person, number: newNumber})
        .then((updatedPerson) => {
          setPersons(persons.map(p => p.id !== person.id ? p : updatedPerson ))
          notifyWith(`phone number of ${person.name} updated!`)
        })
        .catch(() => {
          notifyWith(`${person.name} has already been removed`, 'error')
          setPersons(persons.filter(p => p.id !== person.id))
        })
        setNewName('')
        setNewNumber('')
    }
  }

  const deletePerson = person => {
    if(window.confirm(`Delete ${person.name}?`)) {
      personService
      .remove(person.id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== person.id))
        notifyWith(`number of ${person.name} deleted!`)
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
      <Notification info={info}/>
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