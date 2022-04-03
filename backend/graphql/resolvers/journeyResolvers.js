const Journey = require('../../models/Journey')
const Marker = require('../../models/Marker');
const Suggestion = require('../../models/Suggestion');

const isAuthenticated = (context) => {
    if (!context.req.session || !context.req.session.username) throw new Error("User is not authenticated.");
}

const isAuthorized = (context, username, owner = null) => {
    if (context.req.session.username != username && context.req.session.username != owner) throw new Error("User is not authorized.");
}

const journeyResolvers = {
    Query: {
        getJourneys: async (_, { page }, context) => {
            isAuthenticated(context)
            return await Journey.find({}).sort({ createdAt: -1 }).skip(page * 10).limit(10);
        },
        getJourney: async (_, { journeyId }) => {
            return await Journey.findById(journeyId);
        },
        getJourneysLength: async (_, args) => {
            return await Journey.count({});
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
            isAuthenticated(context);
            const { title, imageId, description, fromDate, toDate, suggestionsEnabled, isPublic, journeyType } = args.journey
            const journey = new Journey(
                {
                    username: context.req.session.username,
                    title,
                    imageId,
                    description,
                    fromDate,
                    toDate,
                    published: false,
                    suggestionsEnabled,
                    isPublic,
                    journeyType
                })
            await journey.save();
            console.log(journey);
            return journey;

        },
        createMarker: async (_, args, context) => {
            isAuthenticated(context);
            const { journeyId, title, place, description, date, latitude, longitude, imageId } = args.marker;
            //todo: so when someone makes a journey without markers, it's not shown until they create one
            Journey.updateOne({ _id: journeyId }, { $set: { published: true } });
            const marker = new Marker({ journeyId, title, place, description, date, latitude, longitude, imageId })
            await marker.save();
            return marker;
        },
        createSuggestion: async (_, args, context) => {
            isAuthenticated(context);
            if (!context.req.session || !context.req.session.username) throw new Error("User must be authenticated");
            const { markerId, imageId, description, type, longitude, latitude } = args.suggestion;
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
        },
        deleteJourney: async (_, { journeyId }, context) => {
            isAuthenticated(context);
            const journey = await Journey.findById(journeyId);
            isAuthorized(context, journey.username);
            // if (context.req.session.username != journey.username) throw new Error("Can not delete other user's journeys");
            await Journey.deleteOne(journey)
            return journey;
        },
        deleteMarker: async (_, { markerId }, context) => {
            isAuthenticated(context);
            const marker = await Marker.findById(markerId);
            const journey = await Journey.findById(marker.journeyId);
            isAuthorized(context, journey.username);
            // if (context.req.session.username != marker.username) throw new Error("User is not authorized");
            await Marker.deleteOne(marker);
            return marker;
        },
        deleteSuggestion: async (_, { suggestionId }, context) => {
            isAuthenticated(context);
            const suggestion = await Suggestion.findById(suggestionId);
            const marker = await Marker.findById(suggestion.markerId);
            const journey = await Journey.findById(marker.journeyId);
            isAuthorized(context, suggestion.username, journey.username);
            // if (context.req.session.username != suggestion.username && context.req.session.username != journey.username) throw new Error("Can not delete other user's suggestions");
            await Suggestion.deleteOne(suggestion)
            return suggestion;
        }
    }
}

module.exports = journeyResolvers