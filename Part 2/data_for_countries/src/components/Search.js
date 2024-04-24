const Search = ({ search, change }) => {
    return (
        <div>
            find countries <input value={search} onChange={change} />
        </div>
    )
}

export default Search