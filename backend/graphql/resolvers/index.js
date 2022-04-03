const journeyResolvers = require('./journeyResolvers');
const userResolvers = require('./userResolvers');
const commentResolvers = require('./commentResolvers');
const commonResolvers = require('./commonResolvers');
const openTripsResolvers = require('./openTripsResolvers');

module.exports = {
    Query: {
        ...commentResolvers.Query,
        ...commonResolvers.Query,
        ...userResolvers.Query,
        ...journeyResolvers.Query,
        ...openTripsResolvers.Query
    },
    Mutation: {
        ...commentResolvers.Mutation,
        ...userResolvers.Mutation,
        ...journeyResolvers.Mutation
    }
}