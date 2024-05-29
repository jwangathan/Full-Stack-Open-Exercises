import { useState } from "react"

const Blog = ({ blog }) => {
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
          {blog.likes} <button>like</button>
          <br></br>
          {blog.user['name']}
        </div>
      }
    </div>
  )
}

export default Blog