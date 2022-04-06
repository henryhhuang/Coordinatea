const { gql } = require('apollo-server-express');

//todo extract specific typedefs to its own file
module.exports = gql`
    type User {
        id: ID!
        username: String
        email: String
        description: String
        createdAt: String
        following: [String]
    }
    type Comment {
        id: ID!
        parentId: ID
        username: String
        createdAt: String
        parent: Journey
        content: String
        comments: [Comment]
    }
    type Journey {
        id: ID!
        username: String!
        title: String!
        imageId: String!
        description: String!
        fromDate: String!
        toDate: String!
        suggestionsEnabled: Boolean!
        isPublic: Boolean!
        journeyType: String!
    }

    type Marker {
        id: ID!
        journeyId: ID!
        imageId: ID!
        title: String!
        place: String!
        description: String!
        date: String!
        longitude: Float!
        latitude: Float!
    }

    type Suggestion {
        id: ID!
        markerId: ID!
        imageId: ID!
        description: String!
        longitude: Float!
        latitude: Float!
        username: String!
        type: String!
    }

    type PlaceSuggestion {
        xid: String!
        name: String!
        distance: Float!
        type: String!
        longitude: Float!
        latitude: Float!
    }

    input JourneyInput {
        title: String!
        imageId: ID!
        description: String!
        fromDate: String!
        toDate:String!
        suggestionsEnabled: Boolean!
        isPublic: Boolean!
        journeyType: String!
    }

    input MarkerInput {
        journeyId: ID!
        title: String!
        place: String!
        description: String!
        date: String!
        longitude: Float!
        latitude: Float!
        imageId: ID!
    }

    input SuggestionInput {
        markerId: ID!
        imageId: ID!
        description: String!
        longitude: Float!
        latitude: Float!
        type: String!
    }

    input PlaceInput {
        longitude: Float!
        latitude: Float!
        radius: Float!
    }

    type Query {
        getUser: User
        getUserById(id: ID): User!
        getUserByUsername(username: String): User!
        getFollowing(username: String): [User!]!
        getFollowers(username: String): [User!]!
        getUserComments(username: String): [Comment!]!
        getParentComments(id: ID): [Comment!]!
        getUserJourneys(username: String): [Journey!]!
        getJourneys(page: Float!): [Journey!]!
        getJourney(journeyId: ID!): Journey!
        getJourneysLength: Float!
        getMarkers(journeyId: ID): [Marker!]!
        getMapboxKey: String!
        getSuggestions(markerId: ID): [Suggestion!]!
        getPlaceSuggestions(place: PlaceInput): [PlaceSuggestion!]!
    }

    type Mutation {
        follow(subscriberUsername: String, publisherUsername: String): [User!]!
        unfollow(subscriberUsername: String, publisherUsername: String): [User!]!
        createComment(parentId: ID, content: String): Comment!
        deleteComment(commentId: ID): Comment!
        createJourney(journey: JourneyInput): Journey!
        createMarker(marker: MarkerInput): Marker!
        createSuggestion(suggestion: SuggestionInput): Suggestion!
        deleteJourney(journeyId: ID!): Journey!
        deleteMarker(markerId: ID!): Marker!
        deleteSuggestion(suggestionId: ID!): Suggestion!
        updateProfile(username: String, email: String, description: String): User
        changePassword(username: String, oldPassword: String, newPassword: String, passwordConfirm: String): User
    }
`