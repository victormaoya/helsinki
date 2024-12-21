const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://helios:${password}@cassavetes.n7xpk.mongodb.net/testBlogApp?retryWrites=true&w=majority&appName=Cassavetes`

mongoose.set('strictQuery', false)

mongoose.connect(url).then(() => {
  const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
  })

  const Blog = mongoose.model('Blog', blogSchema)

  const blog = new Blog({
    title: 'the Grand Canyon',
    author: 'J. Edgar Hoover',
    url: 'https://canyon.io',
    likes: 67
  })

  blog.save().then(() => {
    console.log('blog saved!')
    mongoose.connection.close()
  })

  Blog.find({}).then((result) => {
    result.forEach((blog) => {
      console.log(blog)
    })
    mongoose.connection.close()
  })
})
