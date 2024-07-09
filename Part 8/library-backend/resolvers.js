const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const resolvers = {
	Query: {
		bookCount: () => Book.collection.countDocuments(),
		authorCount: () => Author.collection.countDocuments(),
		allBooks: async (root, args) => {
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

			pubsub.publish('BOOK_ADDED', { bookAdded: book })

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
	Subscription: {
		bookAdded: {
			subscribe: () => pubsub.asyncIterator('BOOK_ADDED'),
		},
	},
}

module.exports = resolvers
