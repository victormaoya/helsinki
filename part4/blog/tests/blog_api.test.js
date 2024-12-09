const { describe, test, after, beforeEach } = require('node:test')
const assert = require('node:assert/strict')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'the Golden Gate',
    author: 'Steve Jobs',
    url: 'https://golden.dev',
    likes: 106,
  },
  {
    title: 'SeaTac',
    author: 'Jeff Bezos',
    url: 'https://seatac.io',
    likes: 57,
  },
  {
    title: 'the Pyramids of Giza',
    author: 'Haile Selassie',
    url: 'https://giza.org',
    likes: 24,
  },
  {
    title: 'Boeing 747',
    author: 'Al Pacino',
    url: 'https://boeing-747.org',
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

test('all blogs are returned in JSON', async () => {
  const blogs = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(blogs.body.length, 4)
})

test('unique id returned as id instead of _id', async () => {
  const blogs = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const firstBlog = blogs.body[0]

  assert(firstBlog.hasOwnProperty('id'))
})

describe('adding blogs', async () => {
  test('new blog can be added', async () => {
    let response = await api.get('/api/blogs')
    const blogsAtStart = response.body
  
    const newBlog = {
      title: 'Titanic',
      author: 'Marlon Brando',
      url: 'https://titanic.org',
      likes: 108,
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    response = await api.get('/api/blogs')
    const blogsAtEnd = response.body
  
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)
  })
  
  test('if title or url missing, return 400 bad request', async () => {
    const newBlog = {
      author: 'D.B. Cooper',
      likes: 32,
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})

test('a blog without the likes property defaults likes to 0', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body

  blogs.forEach((blog) => {
    if (!blog.hasOwnProperty('likes')) {
      blog.likes = 0
    }
  })

  assert(blogs.every(blog => 'likes' in blog))
})

after(async () => {
  await mongoose.connection.close()
})
