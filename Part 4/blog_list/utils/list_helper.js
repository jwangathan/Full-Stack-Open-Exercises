const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (prev, curr) => {
    return (prev && prev.likes > curr.likes) ? prev : curr
  }

  return blogs.reduce(reducer, null)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}