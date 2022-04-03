const Comment = require('../../models/Comment');
const User = require('../../models/User');
const Journey = require('../../models/Journey');
const resolverUtils = require('./resolverUtils');

const commentResolvers = {
    Query: {
        /*
        getUserComments: async (_, { id }, context) => {
            console.log(context.req.session);
            const user = await User.findById(id);
            if (!user)
                throw new Error("User does not exist");
            const comments = await Comment.find({ userId: id });
            if (comments)
                return comments
            return []
        },
        */
        getParentComments: async (_, { id }, context) => {
            resolverUtils.isAuthenticated(context)
            const journey = await Journey.findById(id);
            const comment = await Comment.findById(id);
            if (!(journey || comment))
                throw new Error("Parent object does not exist");
            const comments = await Comment.find({ parentId: id });
            if (comments)
                return comments
            return [];
        }
    },
    Mutation: {
        createComment: async (_, { parentId, content }, context) => {
            resolverUtils.isAuthenticated(context)
            const user = await User.findById(context.req.session.uid);
            if (!user)
                throw new Error("User does not exist");
            const journey = await Journey.findById(parentId);
            const comment = await Comment.findById(parentId);
            if (!(journey || comment))
                throw new Error("Unable to create comment. Parent object does not exist.");
            const newComment = new Comment({
                userId: context.req.session.uid,
                username: user.username,
                parentId: parentId,
                content: content,
                createdAt: new Date().toISOString()
            });
            await newComment.save();
            return newComment;
        },
        /*
        deleteComment: async (_, { id }, context) => {
            console.log(context);
            const comment = await Comment.findById(id);
            if (!comment)
                throw new Error("Comment does not exist");

        }
        */
    }
}

module.exports = commentResolvers;