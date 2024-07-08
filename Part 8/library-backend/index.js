const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
require('dotenv').config()
const jwt = require('jsonwebtoken')

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose
	.connect(MONGODB_URI)
	.then(() => {
		console.log('connected to MongoDB')
	})
	.catch((error) => {
		console.log('error connection to MongoDB:', error.message)
	})

let authors = [
	{
		name: 'Robert Martin',
		id: 'afa51ab0-344d-11e9-a414-719c6709cf3e',
		born: 1952,
	},
	{
		name: 'Martin Fowler',
		id: 'afa5b6f0-344d-11e9-a414-719c6709cf3e',
		born: 1963,
	},
	{
		name: 'Fyodor Dostoevsky',
		id: 'afa5b6f1-344d-11e9-a414-719c6709cf3e',
		born: 1821,
	},
	{
		name: 'Joshua Kerievsky', // birthyear not known
		id: 'afa5b6f2-344d-11e9-a414-719c6709cf3e',
	},
	{
		name: 'Sandi Metz', // birthyear not known
		id: 'afa5b6f3-344d-11e9-a414-719c6709cf3e',
	},
]

let books = [
	{
		title: 'Clean Code',
		published: 2008,
		author: 'Robert Martin',
		id: 'afa5b6f4-344d-11e9-a414-719c6709cf3e',
		genres: ['refactoring'],
	},
	{
		title: 'Agile software development',
		published: 2002,
		author: 'Robert Martin',
		id: 'afa5b6f5-344d-11e9-a414-719c6709cf3e',
		genres: ['agile', 'patterns', 'design'],
	},
	{
		title: 'Refactoring, edition 2',
		published: 2018,
		author: 'Martin Fowler',
		id: 'afa5de00-344d-11e9-a414-719c6709cf3e',
		genres: ['refactoring'],
	},
	{
		title: 'Refactoring to patterns',
		published: 2008,
		author: 'Joshua Kerievsky',
		id: 'afa5de01-344d-11e9-a414-719c6709cf3e',
		genres: ['refactoring', 'patterns'],
	},
	{
		title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
		published: 2012,
		author: 'Sandi Metz',
		id: 'afa5de02-344d-11e9-a414-719c6709cf3e',
		genres: ['refactoring', 'design'],
	},
	{
		title: 'Crime and punishment',
		published: 1866,
		author: 'Fyodor Dostoevsky',
		id: 'afa5de03-344d-11e9-a414-719c6709cf3e',
		genres: ['classic', 'crime'],
	},
	{
		title: 'Demons',
		published: 1872,
		author: 'Fyodor Dostoevsky',
		id: 'afa5de04-344d-11e9-a414-719c6709cf3e',
		genres: ['classic', 'revolution'],
	},
]

const typeDefs = `
	type Author {
		name: String!
		born: Int
		bookCount: Int!
		id: ID!
	}

	type Book {
		title: String!
		published: Int!
		author: Author!
		genres: [String!]!
		id: ID!
	}

	type User {
		username: String!
		favoriteGenre: String!
		id: ID!
	}

	type Token {
		value: String!
	}

	type Mutation {
		addBook(
			title: String!
			published: Int!
			author: String!
			genres: [String!]!
		): Book

		editAuthor(
			name: String!
			setBornTo: Int!
		): Author

		createUser(
			username: String!
			favoriteGenre: String!
		): User

		login(
			username: String!
			password: String!
		): Token
	}

  type Query {
    bookCount: Int!
		authorCount: Int!
		allBooks(author: String, genre: String): [Book!]!
		allAuthors: [Author!]!
		me: User
  }
`

const resolvers = {
	Query: {
		bookCount: () => Book.collection.countDocuments(),
		authorCount: () => Author.collection.countDocuments(),
		allBooks: async (root, args) => {
			// return books.filter((b) => {
			// 	return (
			// 		(!args.author || b.author === args.author) &&
			// 		(!args.genre || b.genres.includes(args.genre))
			// 	)
			// })
			if (args.genre) {
				return Book.find({ genres: args.genre })
			}
			return Book.find({})
		},
		allAuthors: async (root, args) => {
			return Author.find({})
		},
		me: (root, args, context) => {
			return context.currentUser
		},
	},
	Author: {
		bookCount: async (root) =>
			Book.collection.countDocuments({ author: root._id }),
	},
	Book: {
		author: async (root) => {
			const author = await Author.findById(root.author)
			return {
				id: author.id,
				name: author.name,
				born: author.born,
			}
		},
	},
	Mutation: {
		addBook: async (root, args, context) => {
			const currentUser = context.currentUser

			if (!currentUser) {
				throw new GraphQLError('not authenticated', {
					extensions: {
						code: 'BAD_USER_INPUT',
					},
				})
			}

			const existing = await Book.findOne({ title: args.title })
			if (existing) {
				throw new GraphQLError('Title must be unique', {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: args.title,
					},
				})
			}

			if (args.title.length < 5) {
				throw new GraphQLError('Title must be at least five characters', {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: args.title,
					},
				})
			}

			if (args.author.length < 4) {
				throw new GraphQLError('Author name must be at least 4 characters', {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: args.author,
					},
				})
			}

			let author = await Author.findOne({ name: args.author })
			if (!author) {
				try {
					author = await new Author({ name: args.author }).save()
				} catch (error) {
					throw new GraphQLError('Saving author failed', {
						extensions: {
							code: 'BAD_USER_INPUT',
							invalidArgs: args.author,
							error,
						},
					})
				}
			}

			const book = new Book({ ...args, author: author })

			try {
				await book.save()
			} catch (error) {
				throw new GraphQLError('Saving book failed', {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: args.title,
						error,
					},
				})
			}
			return book
		},
		editAuthor: async (root, args, context) => {
			const currentUser = context.currentUser
			if (!currentUser) {
				throw new GraphQLError('not authenticated', {
					extensions: {
						code: 'BAD_USER_INPUT',
					},
				})
			}
			const author = await Author.findOne({ name: args.name })
			author.born = args.setBornTo

			try {
				await author.save()
			} catch (error) {
				throw new GraphQLError('Changing birth year failed', {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: args.name,
						error,
					},
				})
			}

			return author
		},
		createUser: async (root, args) => {
			const user = new User({
				username: args.username,
				favoriteGenre: args.favoriteGenre,
			})

			return user.save().catch((error) => {
				throw new GraphQLError('Creating the user failed', {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: args.username,
						error,
					},
				})
			})
		},
		login: async (root, args) => {
			const user = await User.findOne({ username: args.username })

			if (!user || args.password !== 'secret') {
				throw new GraphQLError('wrong credentials', {
					extensions: {
						code: 'BAD_USER_INPUT',
					},
				})
			}

			const userForToken = {
				username: user.username,
				id: user._id,
			}

			return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
		},
	},
}

const server = new ApolloServer({
	typeDefs,
	resolvers,
})

startStandaloneServer(server, {
	listen: { port: 4000 },
	context: async ({ req, res }) => {
		const auth = req ? req.headers.authorization : null
		if (auth && auth.startsWith('Bearer ')) {
			const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
			const currentUser = await User.findById(decodedToken.id)
			return { currentUser }
		}
	},
}).then(({ url }) => {
	console.log(`Server ready at ${url}`)
})
