const Blog = require('../models/blog')
const User = require('../models/user')

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

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb, usersInDb
}