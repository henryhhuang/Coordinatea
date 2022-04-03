const User = require('../../models/User');
const Comment = require('../../models/Comment');
const Journey = require('../../models/Journey');
const resolverUtils = require('./resolverUtils');

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
            const user = await User.find({ username: username });
            if (!user)
                throw new Error("User does not exist");
            return user.following;
        },
        getFollowers: async (_, { username }, context) => {
            resolverUtils.isAuthenticated(context)
            const user = await User.find({ username: username });
            if (!user)
                throw new Error("User does not exist");
            return user.followers;
        },
        getUserJourneys: async (_, { username }, context) => {
            resolverUtils.isAuthenticated(context)
            //console.log(context.req.session)
            //console.log(username);
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
            console.log(result);
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
            const subscriber = await User.find({ username: subscriberUsername });
            const publisher = await User.find({ username: publisherUsername });
            if (!(subscriber && publisher))
                throw new Error("User does not exist");
            const newFollowing = [...subscriber.following, publisherUsername];
            const newFollowers = [...publisher.followers, subscriberUsername];
            await User.updateOne({ username: subscriberUsername }, { following: newFollowing });
            await User.updateOne({ username: subscriberUsername }, { following: newFollowing });
            return await User.find({ username: { $in: newFollowing } });;
        },
        unfollow: async (_, { subscriberUsername, publisherUsername }, context) => {
            resolverUtils.isAuthenticated(context)
            resolverUtils.isAuthorized(context, subscriberUsername);
            const subscriber = await User.findById(subscriberUsername);
            const publisher = await User.findById(publisherUsername);
            if (!(subscriber && publisher))
                throw new Error("user does not exist");
            const newFollowing = subscriber.following.splice(1, publisherUsername);
            const newFollowers = publisher.followers.splice(1, subscriberUsername);
            await User.updateOne({ username: subscriberUsername }, { following: newFollowing });
            await User.updateOne({ username: publisherUsername }, { followers: newFollowers });
            return await User.find({ username: { $in: newFollowing } });
        },

    }
}

module.exports = userResolvers