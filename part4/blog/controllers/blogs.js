const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  if (!(body.hasOwnProperty('title') || blog.hasOwnProperty('url'))) {
    return response.status(400).json({ error: 'title or url missing' })
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  console.log(decodedToken.id)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  })
  response.json(updatedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const userid = decodedToken.id

  const blog = await Blog.findById(request.params.id)
  console.log('BLOG:', blog)

  if (blog.user.toString() !== userid.toString()) {
    return response.status(403).json({ error: 'only the creator of the blog can delete it' })
  }

  await Blog.findByIdAndDelete(blog.id)
  
  response.status(204).end()
})

module.exports = blogsRouter