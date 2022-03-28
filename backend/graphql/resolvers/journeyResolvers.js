const Journey = require('../../models/Journey')
const Marker = require('../../models/Marker');
const Suggestion = require('../../models/Suggestion');

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
            });
            return marker;
        },
        getSuggestions: async (_, args) => {
            const { markerId } = args;
            let suggestions = await Suggestion.find({
                "markerId": markerId
            });
            return suggestions
        }
    },
    Mutation: {
        createJourney: async (_, args, context) => {
            if (context.req.session && context.req.session.username) {
                const { title, imageId, description, fromDate, toDate } = args.journey
                const journey = new Journey(
                    { username: context.req.session.username, 
                        title, 
                        imageId, 
                        description, 
                        fromDate, 
                        toDate, 
                        published: false 
                    })
                await journey.save();
                return journey;
            }
        },
        createMarker: async (_, args) => {
            const { journeyId, title, place, description, date, latitude, longitude, imageId } = args.marker;
            //todo: so when someone makes a journey without markers, it's not shown until they create one
            Journey.updateOne({_id : journeyId}, { $set: {published: true} });
            const marker = new Marker({ journeyId, title, place, description, date, latitude, longitude, imageId })
            await marker.save();
            return marker;
        },
        createSuggestion: async (_, args, context) => {
            if (context.req.session && context.req.session.username) {
                const { markerId, imageId, description, type, longitude, latitude} = args.suggestion;
                const suggestion = new Suggestion({
                    markerId,
                    imageId,
                    description,
                    type,
                    longitude,
                    latitude,
                    username: context.req.session.username
                })
                await suggestion.save();
                return suggestion;
            }
        }
    }
}

module.exports = journeyResolvers