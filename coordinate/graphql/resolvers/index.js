const usersResolvers = require('./users');
const commentsResolvers = require('./comments');

module.exports = {
    Query: {
        ...usersResolvers.Query,
        ...commentsResolvers.Query,
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...commentsResolvers.Mutation,
    }
}