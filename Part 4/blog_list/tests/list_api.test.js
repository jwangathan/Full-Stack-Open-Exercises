const { describe, test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const helper = require('./test_helper')

const Blog = require('../models/blog')
const User = require('../models/user')

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are the right number of blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blogs have the right id', async () => {
    const response = await helper.blogsInDb()
  
    for (let blog of response) {
      assert(blog.id)
    }
  })

  test('likes property exists', async () => {
    const newBlog = {
      title: 'i dont have likes',
      author: 'sam guo',
      url: 'url this'
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
      const response = await helper.blogsInDb()
      const currentBlog = await response.find(b => b.title === 'i dont have likes')
      assert.strictEqual(currentBlog.likes, 0)
  })

  test('update existing blog properties', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      title: 'new title time',
      author: 'joseph byun',
      url: 'new url time',
      likes: 100000000
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(updatedBlog.likes, blogsAtEnd[0].likes)
  })
})

describe.only('addition of a new blog', () => {
  beforeEach(async() => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
    await User.deleteMany({})
    await api
      .post('/api/users')
      .send(helper.initialUser)
  })

  test('a valid blog can be added', async () => {
    const res = await api.post('/api/login').send({ username:helper.initialUser.username, password: helper.initialUser.password })
    const token = res.body.token

    const newBlog = {
      title: 'New blog time',
      author: 'Brian Che',
      url: 'url time',
      likes: 1000
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const response = await api.get('/api/blogs')
  
    const contents = response.body.map(r => r.title)
    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
    assert(contents.includes('New blog time'))
  })

  test('fails with status code 400 if content is invalid', async () => {
    const res = await api.post('/api/login').send({ username:helper.initialUser.username, password: helper.initialUser.password })
    const token = res.body.token
    
    const newBlog = {
      author: 'Jonathan Wang',
      url: 'new url',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)

    const BlogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(BlogsAtEnd.length, helper.initialBlogs.length)
  })

  test.only('fails with status code 401 if token is not provided', async () => {
    const newBlog = {
      title: 'new blog again',
      author: 'Jonathan Wang',
      url: 'new url',
      likes: 1,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
    
      const BlogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(BlogsAtEnd.length, helper.initialBlogs.length)
  })
})

describe('deletion of blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

    const titles = blogsAtEnd.map(r => r.title)
    assert(!titles.includes(blogToDelete.title))
  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async() => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'jwangathan',
      name: 'Jonathan Wang',
      password: 'password',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
      
      const usernames = usersAtEnd.map(u => u.username)
      assert(usernames.includes(newUser.username))
  })

  test('creation fails with a username and password that is less than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'jo',
      name: 'jonathan',
      password: 'ok'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtStart.length, usersAtEnd.length)

    const usernames = usersAtEnd.map(u => u.username)
    assert(!usernames.includes(newUser.username))
  })
})

after(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})