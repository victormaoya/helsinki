const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((sum, blog) => {
        return sum + blog.likes
      }, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  return blogs.reduce((mostLiked, currentBlog) => {
    return currentBlog.likes > mostLiked.likes
      ? {
          title: currentBlog.title,
          author: currentBlog.author,
          likes: currentBlog.likes,
        }
      : {
          title: mostLiked.title,
          author: mostLiked.author,
          likes: mostLiked.likes,
        }
  })
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const blogsByAuthor = _.groupBy(blogs, 'author')

  const blogsCount = _.mapValues(
    blogsByAuthor,
    (authorBlogs) => authorBlogs.length
  )

  const mostBlogsAuthor = _.maxBy(
    Object.entries(blogsCount),
    ([, count]) => count
  )

  return {
    author: mostBlogsAuthor[0],
    blogs: mostBlogsAuthor[1],
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const blogsByAuthor = _.groupBy(blogs, 'author')

  const authorLikes = _.mapValues(blogsByAuthor, (authorBlogs) =>
    _.sumBy(authorBlogs, 'likes')
  )

  const mostLikedAuthor = _.maxBy(
    Object.entries(authorLikes),
    ([, totalLikes]) => totalLikes
  )

  return {
    author: mostLikedAuthor[0],
    likes: mostLikedAuthor[1]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
