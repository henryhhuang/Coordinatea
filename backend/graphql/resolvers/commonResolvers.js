const { MAPBOX_KEY } = require('../../config');

const commonResolvers = {
    Query: {
        //From what I found theres not really any good ways to secure the mapbox key other than restricting
        //todo: restrict mapbox key usage to our url
        getMapboxKey: async (_, args, context) => {
            if (!context.req.session.username) throw new Error("User is not logged in")
            return MAPBOX_KEY;
        },
    },
}

module.exports = commonResolvers;