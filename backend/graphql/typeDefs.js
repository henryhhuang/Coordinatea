const { gql } = require('apollo-server-express');

//todo extract specific typedefs to its own file
module.exports = gql`
    type User {
        id: ID!
        username: String
        email: String
        createdAt: String
        following: [User]
    }
    type Comment {
        id: ID!
        username: String
        createdAt: String
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

    input JourneyInput {
        title: String!
        imageId: ID!
        description: String!
        fromDate: String!
        toDate:String!
        suggestionsEnabled: Boolean!
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

    type Query {
        getUser: User
        getUserById(id: ID): User!
        getUserByUsername(username: String): User!
        getFollowing(id: ID): [User!]!
        getUserComments(id: ID): [Comment!]!
        getParentComments(id: ID): [Comment!]!
        getUserJourneys(id: ID): [Journey!]!
        getJourneys: [Journey!]!
        getJourney(journeyId: ID): Journey!
        getMarkers(journeyId: ID): [Marker!]!
        getMapboxKey: String!
        getSuggestions(markerId: ID): [Suggestion!]!
    }

    type Mutation {
        follow(subscriberId: ID, publisherId: ID): [User!]!
        unfollow(subscriberId: ID, publisherId: ID): [User!]!
        createComment(parentId: ID, content: String): Comment!
        createJourney(journey: JourneyInput): Journey!
        createMarker(marker: MarkerInput): Marker!
        createSuggestion(suggestion: SuggestionInput): Suggestion!
    }
`