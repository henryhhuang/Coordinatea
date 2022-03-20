const User = require('../../models/User');
const Comment = require('../../models/Comment');
const Journey = require('../../models/Journey');

const userResolvers = {
    Query: {
        getUserById: async (_, { id }, context) => {
            console.log(context.req.session);
            const user = await User.findById(id);
            if (!user)
                throw new Error("User does not exist");
            return user;
        },
        /*
        getUserByUsername: async (_, { username }, context) => {
            console.log(context.req.session);
            const user = await User.find({ username: username });
            if (!user)
                throw new Error("User does not exist");
            return user;
        },
        */
        getFollowing: async (_, { id }, context) => {
            console.log(context.req.session);
            const user = await User.findById(id);
            if (!user)
                throw new Error("User does not exist");
            return user.following;
        },
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
        follow: async (_, { subscriberId, publisherId }, context) => {
            console.log(context.req.session);
            const subscriber = await User.findById(subscriberId);
            const publisher = await User.findById(publisherId);
            if (!(subscriber && publisher))
                throw new Error("User does not exist");
            const newFollowing = [...user.following, publisherId];
            const result = await User.updateOne({ id: subscriberId }, { following: newFollowing });
            return await User.find({ id: { $in: newFollowing } });;
        },
        unfollow: async (_, { subscriberId, publisherId }, context) => {
            console.log(context.req.session);
            const subscriber = await User.findById(subscriberId);
            const publisher = await User.findById(publisherId);
            if (!(subscriber && publisher))
                throw new Error("user does not exist");
            const newFollowing = user.following.splice(1, publisherId);
            const result = await User.updateOne({ id: subscriberId }, { following: newFollowing });
            return await User.find({ id: { $in: newFollowing } });
        },

    }
}

module.exports = userResolvers