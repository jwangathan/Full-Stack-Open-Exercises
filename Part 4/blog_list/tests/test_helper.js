const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'This is the Title',
    author: 'Jonathan Wang',
    url: 'this is url',
    likes: 100
  },
  {
    title: 'This is another Title',
    author: 'Lindsey Chheng',
    url: 'this is another url',
    likes: 1
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb
}