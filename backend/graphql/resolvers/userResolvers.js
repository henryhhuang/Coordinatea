const User = require('../../models/User');
const Comment = require('../../models/Comment');
const Journey = require('../../models/Journey');
const resolverUtils = require('./resolverUtils');
const bcrypt = require('bcrypt');
const { SALT_ROUNDS } = require('../../config/config.js');

const userResolvers = {
    Query: {
        getUser: async (_, __, context) => {
            resolverUtils.isAuthenticated(context)
            if (context.req.session.uid) {
                const user = await User.findById(context.req.session.uid);
                if (!user)
                    throw new Error("User does not exist");
                console.log(user.username);
                return user;
            }
            return null;
        },
        getUserById: async (_, { id }, context) => {
            resolverUtils.isAuthenticated(context)
            const user = await User.findById(id);
            if (!user)
                throw new Error("User does not exist");
            return user;
        },
        getUserByUsername: async (_, { username }, context) => {
            resolverUtils.isAuthenticated(context)
            const user = await User.findOne({ username: username });
            if (!user)
                throw new Error("User does not exist");
            return user;
        },
        getFollowing: async (_, { username }, context) => {
            resolverUtils.isAuthenticated(context)
            const user = await User.findOne({ username: username });
            if (!user)
                throw new Error("User does not exist");
            return await User.find({ username: { $in: user.following } });;
        },
        getFollowers: async (_, { username }, context) => {
            console.log('followers' + username);
            resolverUtils.isAuthenticated(context)
            const user = await User.findOne({ username: username });
            if (!user)
                throw new Error("User does not exist");
            return await User.find({ username: { $in: user.followers } });;
        },
        getUserJourneys: async (_, { username }, context) => {
            resolverUtils.isAuthenticated(context)
            const journeys = await Journey.find({ username: username });
            return journeys;
        },
        getUserComments: async (_, { username }, context) => {
            resolverUtils.isAuthenticated(context)
            const comments = await Comment.find({ username: username });
            const result = await Promise.all(comments.map(async (comment) => {
                var journey = await Journey.findById(comment.parentId).then();
                var newComment = { ...comment._doc, parent: journey }
                console.log(newComment);
                return newComment
            }));
            return result;
        }
        /*
        getUserComments: async (_, { id }, context) => {
            console.log(context.req.session);
            console.log(id);
            const user = await User.findById(id);
            if (!user)
                throw new Error("User does not exist");
            return await Comment.find({ username: user.username });
        },
        getUserJourneys: async (_, { id }, context) => {
            console.log(context.req.session)
            console.log(id);
        }
        */
    },
    Mutation: {
        follow: async (_, { subscriberUsername, publisherUsername }, context) => {
            resolverUtils.isAuthenticated(context)
            resolverUtils.isAuthorized(context, subscriberUsername);
            const subscriber = await User.findOne({ username: subscriberUsername });
            const publisher = await User.findOne({ username: publisherUsername });
            if (publisher.followers.includes(subscriberUsername))
                return await User.find({ username: { $in: newFollowing } });;
            if (!(subscriber && publisher))
                throw new Error("User does not exist");
            const newFollowing = [...subscriber.following, publisherUsername];
            const newFollowers = [...publisher.followers, subscriberUsername];
            await User.updateOne({ username: subscriberUsername }, { following: newFollowing });
            await User.updateOne({ username: publisherUsername }, { followers: newFollowers });
            return await User.find({ username: { $in: newFollowing } });;
        },
        unfollow: async (_, { subscriberUsername, publisherUsername }, context) => {
            resolverUtils.isAuthenticated(context)
            resolverUtils.isAuthorized(context, subscriberUsername);
            const subscriber = await User.findOne({ username: subscriberUsername });
            const publisher = await User.findOne({ username: publisherUsername });
            if (!(subscriber && publisher))
                throw new Error("user does not exist");
            var newFollowing = subscriber.following
            const indexPublisher = subscriber.following.indexOf(publisherUsername)
            if (indexPublisher > -1) {
                newFollowing.splice(indexPublisher, 1);
            }
            var newFollowers = publisher.followers
            const indexSubscriber = newFollowers.indexOf(subscriberUsername)
            if (indexSubscriber > -1) {
                newFollowers.splice(indexSubscriber, 1);
            }
            await User.updateOne({ username: subscriberUsername }, { following: newFollowing });
            await User.updateOne({ username: publisherUsername }, { followers: newFollowers });
            return await User.find({ username: { $in: newFollowing } });
        },
        updateProfile: async (_, { username, email, description }, context) => {
            resolverUtils.isAuthenticated(context)
            resolverUtils.isAuthorized(context, username)
            const response = await User.updateOne({ username: username }, { email: email, description: description })
            return await User.findOne({ username: username })
            //return await User.find({ username: username })

        },
        changePassword: async (_, { username, oldPassword, newPassword, passwordConfirm }, context) => {
            console.log(username, oldPassword, newPassword, passwordConfirm)
            resolverUtils.isAuthenticated(context)
            resolverUtils.isAuthorized(context, username)
            const user = await User.findOne({ username: username })
            if (!user)
                throw new Error("User does not exist");
            const auth = await bcrypt.compare(oldPassword, user.password,)
            if (!auth)
                throw new Error("Incorrect password");
            if (newPassword != passwordConfirm)
                throw new Error("Password and Confirm Password do not match")
            const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
            await User.updateOne({ username: username, password: hashedPassword });
            return User.findOne({ username: username });
        }

    }
}

module.exports = userResolvers