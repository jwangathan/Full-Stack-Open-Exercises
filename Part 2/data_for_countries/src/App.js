import Search from "./components/Search";
import countryService from "./services/countries"

function App() {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [data, setData] = useState([])

  useEffect(() => {
    console.log('effect run, country is now', search)

    if (search) {
      console.log('fetching country data...')
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/${search}`)
        .then(response => {
          setData(response.data)
        })
    }
  }, [search])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  return (
    <div>
      <Search search={search} change={handleSearchChange} />
      <Countries />
    </div>
  )
}

export default App;
