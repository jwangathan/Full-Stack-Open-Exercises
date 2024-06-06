import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div className='formDiv'>
      <h2>create new</h2>

      <form onSubmit={addBlog}>
        <div>
          Title
          <input
            type='text'
            value={newTitle}
            name='Title'
            onChange={event => setNewTitle(event.target.value)}
            placeholder='write title here'
          />
        </div>
        <div>
          Author
          <input
            type='text'
            value={newAuthor}
            name='Author'
            onChange={event => setNewAuthor(event.target.value)}
            placeholder='write author here'
          />
        </div>
        <div>
          URL
          <input
            type='text'
            value={newUrl}
            name='URL'
            onChange={event => setNewUrl(event.target.value)}
            placeholder='write url here'
          />
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default BlogForm