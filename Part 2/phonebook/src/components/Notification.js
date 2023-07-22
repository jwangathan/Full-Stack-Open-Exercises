const Notification = ({ addMessage, errorMessage}) => {
    const addStyle = {
        color: 'green',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    }

    const errorStyle = {
        color: 'red',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    }

    if (addMessage === null && errorMessage === null) {
        return null
    }

    if(errorMessage !== null) {
        addMessage = null
        return (
            <div style={errorStyle}>
                {errorMessage}
            </div>
        )
    }

    errorMessage=null
    return (
        <div style={addStyle}>
            {addMessage}
        </div>
    )
}

export default Notification