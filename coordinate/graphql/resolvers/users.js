const User = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { JWT_SECRET } = require('../../config.js');

//const { validateRegisterInput } = require('../../util/validation');
const { authentication } = require('../../util/authentication');

module.exports = {
    Query: {
        async getUser(_, { username }) {
            try {
                const user = await User.findOne({ username: username });
                if (!user)
                    throw new Error(`User: ${username} does not exist.`);
                return user;
            } catch (error) {
                throw new Error(error);
            }
        },
        async getFollowing(_, { username }, context) {
            try {
                const auth = authentication(context);
                if (auth.username != username)
                    throw new Error("Unauthorized.");
                const user = await User.findOne({ username: username });
                if (!user)
                    throw new Error(`User: ${username} does not exist.`);
                return await User.find({ username: { $in: user.following } });
            } catch (error) {
                throw new Error(error);
            }
        }
    },

    Mutation: {
        async register(_, { registerInput: { username, password, passwordConfirm, email } }) {
            try {
                /*
                const { errors, valid } = validateRegisterInput(username, email, password, passwordConfirm);
                if (!valid) 
                    throw new Error('Error', { errors });
                */
                const user = await User.findOne({ username: username });
                if (user) {
                    throw new UserInputError('Username is taken', {
                        errors: {
                            username: 'This username is taken'
                        }
                    });
                }

                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                const newUser = new User({
                    username: username,
                    email: email,
                    password: hashedPassword,
                    createdAt: new Date().toISOString(),
                    following: [],
                    comments: [],
                });

                const res = await newUser.save();

                const token = jwt.sign({
                    id: res._id,
                    username: res.username
                }, JWT_SECRET, { expiresIn: 60 * 60 * 24 });

                console.log(token);

                return {
                    ...res._doc,
                    id: res._id,
                    token
                }

            } catch (error) {
                return new Error(error);
            }
        },
        async login(_, { loginInput: { username, password } }) {
            try {
                const user = await User.findOne({ username: username });
                if (!user)
                    return new Error(`Username and password combination does not exist.`);
                const auth = await bcrypt.compare(password, user.password);
                if (!auth) {
                    return new Error(`Username and password combination does not exist.`);
                }

                const token = jwt.sign({
                    id: user._id,
                    username: user.username
                }, JWT_SECRET, { expiresIn: 60 * 60 * 24 });

                console.log(token);

                return {
                    ...user._doc,
                    id: user._id,
                    token
                }

            } catch (error) {
                return new Error(error);
            }
        },
        async follow(_, { followInput: { subscriberUsername, publisherUsername } }, context) {
            try {
                const auth = authentication(context);
                console.log(auth);
                if (auth.username != subscriberUsername)
                    throw new Error("Unauthorized operation.");
                const subscriber = await User.findOne({ username: subscriberUsername });
                const publisher = await User.findOne({ username: publisherUsername });
                if (!(subscriber && publisher))
                    throw new Error(`Invalid username. User not found.`);
                if (subscriber.following.indexOf(publisherUsername) == -1) {
                    const res = await User.updateOne({ username: subscriberUsername }, { following: [...subscriber.following, publisherUsername] });
                }
                return await User.find({ username: { $in: [...subscriber.following, publisherUsername] } });
            } catch (error) {
                throw new Error(error);
            }
        },
        async unfollow(_, { followInput: { subscriberUsername, publisherUsername } }, context) {
            try {
                const auth = authentication(context);
                if (auth.username != subscriberUsername)
                    throw new Error("Unauthorized.");
                const subscriber = await User.findOne({ username: subscriberUsername });
                const publisher = await User.findOne({ username: publisherUsername });
                if (!(subscriber && publisher))
                    throw new Error(`Invalid username. User not found.`);
                if (subscriber.following.indexOf(publisherUsername) == -1) {
                    const res = await User.updateOne({ username: subscriberUsername }, { following: subscriber.following.splice(1, publisherUsername) });
                }
                return await User.find({ username: { $in: subscriber.following } });
            } catch (error) {
                throw new Error(error);
            }
        },
    }
}