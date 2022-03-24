const journeyResolvers = require('./journeyResolvers');
const userResolvers = require('./userResolvers');
const commentResolvers = require('./commentResolvers');
const commonResolvers = require('./commonResolvers');

module.exports = {
    Query: {
        ...commentResolvers.Query,
        ...commonResolvers.Query,
        ...userResolvers.Query,
        ...journeyResolvers.Query,
    },
    Mutation: {
        ...commentResolvers.Mutation,
        ...userResolvers.Mutation,
        ...journeyResolvers.Mutation
    }
}