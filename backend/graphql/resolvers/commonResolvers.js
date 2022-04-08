const { MAPBOX_KEY } = require('../../config/config');

const commonResolvers = {
    Query: {
        getMapboxKey: async (_, args, context) => {
            return MAPBOX_KEY;
        },
    },
}

module.exports = commonResolvers;