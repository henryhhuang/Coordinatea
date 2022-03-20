const Journey = require('../../models/Journey')
const Marker = require('../../models/Marker');

//TODO VALIDATION 

const journeyResolvers = {
    Query: {
        getJourneys: async () => {
            return await Journey.find();
        },
        getJourney: async (_, { id }) => {
            return await Journey.findById(id);
        },
        getMarkers: async (_, args) => {
            const { journeyId } = args;
            let marker = await Marker.find({
                "journeyId": journeyId
            })
            console.log(marker);
            return marker;
        }
    },
    Mutation: {
        createJourney: async (_, args) => {
            const { username, title, imageId, description, fromDate, toDate } = args.journey
            const journey = new Journey({ username, title, imageId, description, fromDate, toDate })
            await journey.save();
            return journey;
        },
        createMarker: async (_, args) => {
            const { journeyId, title, place, description, date, latitude, longitude } = args.marker;
            const marker = new Marker({ journeyId, title, place, description, date, latitude, longitude })
            await marker.save();
            return marker;
        }
    }
}

module.exports = journeyResolvers