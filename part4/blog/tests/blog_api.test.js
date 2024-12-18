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
let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('shishabucks', 10)
  const user = new User({ username: 'root', passwordHash })
  const savedUser = await user.save()

  token = helper.generateToken(savedUser)

  for (let blog of helper.initialBlogs) {
    const blogObject = new Blog({ ...blog, user: savedUser._id })
    await blogObject.save()
  }
})

describe('when initial blogs are already available', () => {
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
  test('succeeds with valid data and token', async () => {
    const newBlog = {
      title: 'Titanic',
      author: 'Marlon Brando',
      url: 'https://titanic.org',
      likes: 108,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  })

  test('fails with 401 if token not provided', async () => {
    const newBlog = {
      title: 'Titanic',
      author: 'Marlon Brando',
      url: 'https://titanic.org',
      likes: 108,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

  test('fails with status code 400 if title or url is missing', async () => {
    const newBlog = {
      author: 'Marlon Brando',
      likes: 108,
    }

    const result = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    assert(result.body.error.includes('title or url missing'))
  })

  test('defaults the likes property to zero if missing', async () => {
    const newBlog = {
      title: 'Tesla',
      author: 'Elon Musk',
      url: 'https://tesla-x.dev',
    }

    const result = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    assert.strictEqual(result.body.likes, 0)
  })
})

describe('updating a blog', () => {
  test('succeeds with status 200 for a valid update', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      title: 'the Golden Gate',
      author: 'Steve Jobs',
      url: 'https://golden.dev',
      likes: 256,
    }

    const result = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(result.body.title, updatedBlog.title)
    assert.strictEqual(result.body.likes, updatedBlog.likes)
  })
})

describe('deleting a blog', () => {
  test('succeeds with status code 204 if user is the creator', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    const otherUser = new User({
      username: 'otheruser',
      passwordHash: await bcrypt.hash('pass1234', 10),
    })

    const savedOtherUser = await otherUser.save()
    const otherToken = helper.generateToken(savedOtherUser)

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(403)
  })
})

describe('when there is initially one user in the db', () => {
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'victormaoya',
      name: 'Victor Maoya',
      password: 'chinook',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper status code and message if username already exists', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'black-panther',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('expected `username` to be unique'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

describe('creating a user', () => {
  test('fails if username or password is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'xander',
      name: 'Xander Cage',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('username or password missing'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('fails if username or password is less than 3 characters long', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'zx',
      name: 'Carl Haileys',
      password: '35',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(
      result.body.error.includes(
        'password and username must be at least 3 characters long'
      )
    )

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtStart.length, usersAtEnd.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
