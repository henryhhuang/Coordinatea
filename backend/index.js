const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors')
const bodyParser = require('body-parser')
const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const path = require('path');
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");


/* Citation: sentryConfig code below taken from : 
https://medium.com/@mahyor.sam/tracking-errors-in-apollo-graphql-with-sentry-549ae52c0c76
*/
const sentryConfig = {
    requestDidStart(_) {
        return {
            didEncounterErrors(ctx) {
                // If we couldn't parse the operation (usually invalid queries)
                if (!ctx.operation) {
                    for (const err of ctx.errors) {
                        Sentry.withScope(scope => {
                            scope.setExtra('query', ctx.request.query);
                            Sentry.captureException(err);
                        });
                    }
                    return;
                }

                for (const err of ctx.errors) {
                    // Add scoped report details and send to Sentry
                    Sentry.withScope(scope => {
                        // Annotate whether failing operation was query/mutation/subscription
                        scope.setTag('kind', ctx.operation.operation);

                        // Log query and variables as extras (make sure to strip out sensitive data!)
                        scope.setExtra('query', ctx.request.query);
                        scope.setExtra('variables', ctx.request.variables);

                        if (err.path) {
                            // We can also add the path as breadcrumb
                            scope.addBreadcrumb({
                                category: 'query-path',
                                message: err.path.join(' > '),
                                level: Sentry.Severity.Debug,
                            });
                        }

                        const transactionId = ctx.request.http.headers.get(
                            'x-transaction-id',
                        );
                        if (transactionId) {
                            scope.setTransaction(transactionId);
                        }

                        Sentry.captureException(err);
                    });
                }
            },
        };
    },
};

Sentry.init({
    dsn: "https://b15301c746614f6d82c2666359ceab98@o1191121.ingest.sentry.io/6312367",
    tracesSampleRate: 1.0,
});

require('dotenv').config();

let multer = require('multer');

let upload;
let isProduction = false;
let domain;

if (process.env.NODE_ENV === "production") {
    upload = multer({ dest: "/backend/uploads" });
    isProduction = true;
    domain = "coordinatea.me";
} else {
    upload = multer({ dest: path.join(__dirname, 'uploads') });
    domain = "localhost";
}

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers/index');


const { MONGODB, SESSION_SECRET, SALT_ROUNDS } = require('./config/config');
const User = require('./models/User');
const Image = require('./models/Image');

app.use(bodyParser.json());

app.use(cors({
    // origin: 'http://147.182.149.236',
    origin: ['https://147.182.149.236', 'https://coordinatea.me', 'http://localhost:3000'],
    credentials: true
}));

app.set('trust proxy', 1)

//todo: https://stackoverflow.com/questions/44882535/warning-connect-session-memorystore-is-not-designed-for-a-production-environm
const session = require('express-session');
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        domain: domain,
        proxy: isProduction,
        httpOnly: true,
        secure: isProduction,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    introspection: true,
    plugins: [sentryConfig],
    context: ({ req, res }) => {
        return { req, res }
    }
});

server.applyMiddleware({ app, cors: { origin: ['https://147.182.149.236', 'https://coordinatea.me', 'http://localhost:3000'], credentials: true } });

// REST endpoint for signup from piazza post @342: https://piazza.com/class/kxgjicgvryu3h8?cid=342
app.post('/signup/', async (req, res, next) => {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
        Sentry.captureException(new Error("Username taken"))
        return res.status(400).json({ error: "Username taken" });
    }
    if (req.body.password != req.body.passwordConfirm) {
        Sentry.captureException(new Error("Passwords do not Match"))
        return res.status(400).json({ error: "Passwords do not match" });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        description: '',
        createdAt: new Date().toISOString(),
    })
    await newUser.save((error, doc, _) => {
        console.log(req.session)
        if (error) {
            Sentry.captureException(error)
            throw new Error(error)
        }
        req.session.uid = doc._id
        req.session.username = newUser.username
        return res.json(doc.username);
    });
});

app.post('/signin/', async (req, res, next) => {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
        Sentry.captureException(new Error("Username and password combination not found."))
        return res.status(400).json({ error: "Username and password combination not found." });
    }
    const auth = await bcrypt.compare(req.body.password, user.password)
    if (!auth) {
        Sentry.captureException(new Error("Username and password combination not found."))
        return res.status(400).json({ error: "Username and password combination not found." });
    }
    req.session.uid = user._id
    req.session.username = user.username
    return res.json("signed in");
});

let isAuthenticated = function (req, res, next) {
    if (!req.session.username) {
        Sentry.captureException(new Error("User must be authenticated"))
        return res.status(401).json({ error: "User must be authenticated." });
    }
    next();
};

//The following are REST endpoints to handle images, https://piazza.com/class/kxgjicgvryu3h8?cid=359
//Upload an image
app.post('/api/image/:id', isAuthenticated, upload.single('file'), async function (req, res, next) {
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

app.get('/signout/', async (req, res, next) => {
    req.session.destroy(function () {
        return res.clearCookie('connect.sid').status(200).send("logged out")
    });
});

mongoose.connect(MONGODB, { useNewUrlParser: true })
    .then(() => {
        console.log('MongoDB Connected...');
        return app.listen({ port: 5000 });
    })
    .then((res) => {
        console.log(`🚀 Server ready at https://147.182.149.236:5000${server.graphqlPath}`)
    })
    .catch((error) => {
        Sentry.captureException(error);
    })