const { MAPBOX_KEY } = require('../../config/config');

const commonResolvers = {
    Query: {
        //From what I found theres not really any good ways to secure the mapbox key other than restricting
        //todo: restrict mapbox key usage to our url
        getMapboxKey: async (_, args, context) => {
            return MAPBOX_KEY;
        },
    },
}

module.exports = commonResolvers;