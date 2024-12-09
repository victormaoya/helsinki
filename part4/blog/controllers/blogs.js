const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog.find({})
    response.json(blogs)
  } catch (exception) {
    console.error(exception)
  }
})

blogsRouter.post('/', async (request, response) => {
  let blog = request.body

  if (!blog.hasOwnProperty('title') || !blog.hasOwnProperty('url')) {
    return response.status(400).end()
  }

  blog = new Blog(request.body)

  try {
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  } catch (exception) {
    console.error(exception)
  }
})

module.exports = blogsRouter
