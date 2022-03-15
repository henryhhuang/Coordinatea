const User = require('../../models/User');
const Comment = require('../../models/Comment');
const { authentication } = require('../../util/authentication');

module.exports = {
    Query: {
        async getUserComments(_, { username }, context) {
            try {
                const auth = authentication(context);
                const user = await User.findOne({username: username})
                if (!user)
                    throw new Error(`User not found`);
                const comments = await Comment.find({_id: { $in: user.comments }});
                return comments;
            } catch (error) {
                throw new Error(error);
            }
        }

    },
    Mutation: {
        async createComment(_, { commentInput: { content } }, context) {
            try {
                const auth = authentication(context);
                console.log(auth)
                const user = await User.findOne({username: auth.username})
                console.log(user);
                const newComment = new Comment({
                    username: auth.username,
                    content: content,
                    createdAt: new Date().toISOString(),
                });

                const res = await newComment.save();
                await User.updateOne({ username: auth.username }, { comments: [...user.comments, res._id] });

                return {
                    ...res._doc,
                }
            } catch (error) {
                return new Error(error);
            }
        },
    }
}