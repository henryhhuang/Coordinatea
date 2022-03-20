const { ApolloServer, gql } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors')
const bodyParser = require('body-parser')
const express = require('express');
const bcrypt = require('bcrypt');
const https = require('https');
const app = express();
const _ = require('lodash');
const path = require('path');
let multer  = require('multer');
let upload = multer({ dest: path.join(__dirname, 'uploads')});

const journeyTypeDefs = require('./typeDefs/journeyTypeDefs')
const journeyResolver = require('./resolvers/journeyResolvers');


const { MONGODB, SESSION_SECRET, SALT_ROUNDS } = require('./config');
const User = require('./models/User');
const Image = require('./models/Image');

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
    typeDefs: [typeDefs, journeyTypeDefs], 
    resolvers: _.merge({}, resolvers, journeyResolver), 
    context: ({ req, res }) => {
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
        req.session.username = newUser.username
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


//The following are REST endpoints to handle images, https://piazza.com/class/kxgjicgvryu3h8?cid=359
//Upload an image
app.post('/api/image/:id', upload.single('file'), async function (req, res, next) {
    console.log(req);
    console.log(req.params);
    console.log(req.body);
    console.log(req.file);

    const newImage = Image({
        journeyId: '',
        markerId: '',
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        encoding: req.file.encoding,
        mimetype: req.file.mimetype,
        destination: req.file.destination,
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size
    })
    if (req.body.action == 'journey') {
        newImage.journeyId = req.params.id
    } else {//marker
        newImage.markerId = req.params.id
    }
    await newImage.save();
    return res.json(newImage._id);
});

//Get a list of all image ids from a journey or marker
app.get('/api/imageIds/:id/:action', async function (req, res, next) {
    let images;
    if (req.params.action == 'journey') {
        images = await Image.find({
            'journeyId': req.params.id
        })
    } else {
        images = await Image.find({
            'markerId': req.params.id
        })
    }
    let imageIds = images.map(image => image._id);

    return res.json(imageIds);
});

//Get the path of the image
app.get('/api/image/:imageId/', async function (req, res, next) {
    let image = await Image.findById(req.params.imageId);
    res.setHeader('Content-Type', image.mimetype);
    res.sendFile(image.path);
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