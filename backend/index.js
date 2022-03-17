const { ApolloServer, gql } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors')
const bodyParser = require('body-parser')
const express = require('express');
const bcrypt = require('bcrypt');
const https = require('https');
const app = express();

const { MONGODB, SESSION_SECRET, SALT_ROUNDS } = require('./config');
const User = require('./models/User');

app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

const session = require('express-session');
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, // TODO: change in production
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    authHello: String!
  },
  type Mutation {
    register(username: String!, password: String!) : Boolean!
    follow(subscriberUsername: String!, publisherUsername: String!): String!
  }
  
`;

// Provide resolver functions for your schema fields
const resolvers = {
    Query: {
        authHello: (_, __, req) => {
            if (req.session.uid) {
                return `Cookie found! Your uid is: ${req.session.id}`
            } else {
                "Could not find cookie"
            }
        },
    },
    Mutation: {
        register: async (_, { username, password }, req) => {
            console.log(req);
            const hashedPassword = await bcrypt.hash(password, 12);
            const newUser = new User({
                username: username,
                password: hashedPassword,
                createdAt: new Date().toISOString(),
                following: [],
                comments: [],
                journeys: [],
            });
            const res = await newUser.save();
            req = "123"
            return true
        },
        follow: (_, args, context) => {
            console.log(context.req.session);
            if (context.req.session.uid) {
                return `UID found! ${context.req.session.uid}`
            } else {
                return `no UID :(`
            }
        },
    }
};

const server = new ApolloServer({
    typeDefs, resolvers, context: ({ req, res }) => {
        return { req, res }
    }
});
server.applyMiddleware({ app, cors: { origin: "http://localhost:3000", credentials: true }});

// REST endpoint for signup from piazza post @342: https://piazza.com/class/kxgjicgvryu3h8?cid=342
app.post('/signup/', async (req, res, next) => {
    const user = await User.findOne({ username: req.body.username });
    if (user)
        return res.status(400).json({ error: "Username taken"});
    if (req.body.password != req.body.passwordConfirm)
        return res.status(400).json({ error: "Passwords do not match"});
    const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
    })
    await newUser.save((error, doc, _) => {
        console.log(req.session)
        if (error)
            throw new Error(error)
        req.session.uid = doc._id
        req.session.username = user.username
        return res.json(doc.username);
    });
});

app.post('/signin/', async (req, res, next) => {
    const user = await User.findOne({ username: req.body.username });
    if (!user)
        return res.status(400).json({ error: "Username and password combination not found."});
    const auth = await bcrypt.compare(req.body.password, user.password)
    if (!auth)
        return res.status(400).json({ error: "Username and password combination not found."});
    req.session.uid = user._id
    req.session.username = user.username
    return res.json("signed in");
});

mongoose.connect(MONGODB, { useNewUrlParser: true })
    .then(() => {
        console.log('MongoDB Connected...');
        return app.listen({ port: 5000 });
    })
    .then((res) => {
        console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`)
    })
    .catch((error) => {
        console.log(error);
    })