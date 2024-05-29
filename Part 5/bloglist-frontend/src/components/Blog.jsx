import { useState } from "react"

const Blog = ({ blog, updateLike, removeBlog, user }) => {
  const [view, setView] = useState(false)
  const label = view ? 'hide' : 'view'
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={() => setView(!view)}>{label}</button>
      {view && 
        <div>
          {blog.url}
          <br></br>
          {blog.likes} <button onClick={updateLike}>like</button>
          <br></br>
          {blog.user.name}
          <br></br>
          {user.username === blog.user.username && 
            <button onClick={removeBlog}>remove</button>
          }
        </div>
      }
    </div>
  )
}

export default Blog