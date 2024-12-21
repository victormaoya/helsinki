const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body

  if (!request.token || !request.user) {
    return response.status(401).json({ error: 'invalid or missing token' })
  }

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'title or url missing' })
  }

  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  const updatedBlog = await Blog
    .findByIdAndUpdate(request.params.id, blog, {
    new: true,
    runValidators: true,
    context: 'query'
  })

  if (!updatedBlog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  response.json(updatedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (!request.user ||  blog.user.toString() !== request.user.id.toString()) {
    return response.status(403).json({ error: 'only the creator of the blog can delete it' })
  }

  await Blog.findByIdAndDelete(blog.id)
  response.status(204).end()
})

module.exports = blogsRouter