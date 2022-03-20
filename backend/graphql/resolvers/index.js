const journeyResolvers = require('./journeyResolvers');
const userResolvers = require('./userResolvers');
const commentResolvers = require('./commentResolvers');

module.exports = {
    Query: {
        ...commentResolvers.Query,
        ...userResolvers.Query,
        ...journeyResolvers.Query,
    },
    Mutation: {
        ...commentResolvers.Mutation,
        ...userResolvers.Mutation,
        ...journeyResolvers.Mutation
    }
}