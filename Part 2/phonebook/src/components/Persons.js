const Person = ({ person, deletePerson } ) => {
	return (
		<div>
		{person.name} {person.number} <button onClick={() => deletePerson(person)} > Delete </button>
		</div>
	)
}

const Persons = ({ filter, showAll, persons, deletePerson }) => {
	const peopleToShow = showAll ? persons : persons.filter(person => person.name.toLowerCase().match(filter))
	return (
		<>
		{peopleToShow.map(person => <Person key={person.name} person={person} deletePerson={deletePerson}/>)}
		</>
	)
}

export default Persons