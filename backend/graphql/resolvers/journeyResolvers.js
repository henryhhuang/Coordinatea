const Journey = require('../../models/Journey')
const Marker = require('../../models/Marker');
const Suggestion = require('../../models/Suggestion');
const resolverUtils = require('./resolverUtils');
const validator = require('validator');

const sanitizeContent = function(content) {
    return validator.escape(content);
}

const journeyResolvers = {
    Query: {
        getJourneys: async (_, { page }, context) => {
            console.log(page)
            const journeys = await Journey.find({ published: true }).sort({ createdAt: -1 }).skip(page * 10)
            return journeys.slice(0, 10)
        },
        getJourney: async (_, { journeyId }) => {
            return await Journey.findById(journeyId);
        },
        getJourneysLength: async (_, args) => {
            return await Journey.count({
                "published": true
            });
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
            resolverUtils.isAuthenticated(context);
            const { title, imageId, description, fromDate, toDate, suggestionsEnabled, isPublic, journeyType } = args.journey;
            const sanitizedTitle = sanitizeContent(title);
            const sanitizedDescription = sanitizeContent(description);
            const journey = new Journey(
                {
                    username: context.req.session.username,
                    title: sanitizedTitle,
                    imageId,
                    description: sanitizedDescription,
                    fromDate,
                    toDate,
                    published: false,
                    suggestionsEnabled,
                    isPublic,
                    journeyType
                })
            await journey.save();
            return journey;

        },
        createMarker: async (_, args, context) => {
            resolverUtils.isAuthenticated(context);
            const { journeyId, title, place, description, date, latitude, longitude, imageId } = args.marker;

            const journey = await Journey.findById(journeyId);
            resolverUtils.isAuthorized(context, journey.username);
            if (!journey.published) {
                await Journey.updateOne({ _id: journeyId }, { $set: { published : true } });
            }

            const sanitizedTitle = sanitizeContent(title);
            const sanitizedDescription = sanitizeContent(description);
            const santiziedPlace = sanitizeContent(place);

            const marker = new Marker({ 
                journeyId, 
                title: sanitizedTitle, 
                place: santiziedPlace,
                description: sanitizedDescription, 
                date, 
                latitude, 
                longitude, 
                imageId });

            await marker.save();
            return marker;
        },
        createSuggestion: async (_, args, context) => {
            resolverUtils.isAuthenticated(context);
            if (!context.req.session || !context.req.session.username) throw new Error("User must be authenticated");
            const { markerId, imageId, description, type, longitude, latitude } = args.suggestion;
            
            const sanitizedDescription = sanitizeContent(description);

            const suggestion = new Suggestion({
                markerId,
                imageId,
                description: sanitizedDescription,
                type,
                longitude,
                latitude,
                username: context.req.session.username
            })
            await suggestion.save();
            return suggestion;
        },
        deleteJourney: async (_, { journeyId }, context) => {
            console.log(journeyId);
            resolverUtils.isAuthenticated(context);
            const journey = await Journey.findById(journeyId);
            resolverUtils.isAuthorized(context, journey.username);
            const result = await Journey.deleteOne(journey)
            console.log(result);
            return journey;
        },
        deleteMarker: async (_, { markerId }, context) => {
            resolverUtils.isAuthenticated(context);
            const marker = await Marker.findById(markerId);
            const journey = await Journey.findById(marker.journeyId);
            resolverUtils.isAuthorized(context, journey.username);
            await Marker.deleteOne(marker);
            return marker;
        },
        deleteSuggestion: async (_, { suggestionId }, context) => {
            resolverUtils.isAuthenticated(context);
            const suggestion = await Suggestion.findById(suggestionId);
            const marker = await Marker.findById(suggestion.markerId);
            const journey = await Journey.findById(marker.journeyId);
            resolverUtils.isAuthorized(context, suggestion.username, journey.username);
            await Suggestion.deleteOne(suggestion)
            return suggestion;
        }
    }
}

module.exports = journeyResolvers