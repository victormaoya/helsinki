const { describe, test, after, beforeEach } = require('node:test')
const assert = require('node:assert/strict')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const User = require('../models/user')
const Blog = require('../models/blog')
const helper = require('./helper')

const api = supertest(app)

describe('when initial blogs are already available', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
  
    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }
  })
  
  test('all blogs are returned in JSON', async () => {
    const blogs = await helper.blogsInDb()
  
    assert.strictEqual(blogs.length, 4)
  })

  test('unique id returned as id instead of _id', async () => {
    const blogs = await helper.blogsInDb()
    const firstBlog = blogs[0]
  
    assert(firstBlog.hasOwnProperty('id'))
  })
})

describe('adding a new blog', () => {
  test('succeeds with valid data', async () => {
    const blogsAtStart = await helper.blogsInDb()
  
    const newBlog = {
      title: 'Titanic',
      author: 'Marlon Brando',
      url: 'https://titanic.org',
      likes: 108,
      userId: '675e8b15efd95f0041dd5fb7'
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await helper.blogsInDb()
  
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)
  })
  
  test('fails with status code 400 bad request if title or url is missing', async () => {
    const blogsAtStart = await helper.blogsInDb()
    
    const newBlog = {
      author: 'D.B. Cooper',
      likes: 32
    }
  
    const result = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('title or url missing'))

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtStart.length, blogsAtEnd.length)
  })

  test('defaults the likes property to zero if missing', async () => {
    const blogs = await helper.blogsInDb()
  
    blogs.forEach((blog) => {
      if (!blog.hasOwnProperty('likes')) {
        blog.likes = 0
      }
    })
  
    assert(blogs.every(blog => 'likes' in blog))
  })
})

describe('updating a blog', () => {
  test('succeeds when a valid id is provided', async () => {
    const updatedBlog = {
      title: 'the Golden Gate',
      author: 'Steve Jobs',
      url: 'https://golden.dev',
      likes: 256
    }

    await api
      .put('/api/blogs/6758664e5fca72574821457b')
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

describe('deleting a blog', () => {
  test('succeeds with status code 204 using a valid id', async () => {
    await api
      .delete('/api/blogs/6758664f5fca72574821457f')
      .expect(204)
  })
})

describe('when there is initially one user in the db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('shishabucks', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'victormaoya',
      name: 'Victor Maoya',
      password: 'chinook'
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

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'black-panther'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

describe('creating a user', () => {
  test('fails if username or password is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'xander',
      name: 'Xander Cage'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('username or password missing'))

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtStart.length, usersAtEnd.length)    
  })

  test('fails if username or password is less than 3 characters long', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'zx',
      name: 'Carl Haileys',
      password: '35'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(result.body.error.includes('password and username must be at least 3 characters long'))

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtStart.length, usersAtEnd.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
