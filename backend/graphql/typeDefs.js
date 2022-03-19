const { gql } = require('apollo-server-express');

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
    }
    type Marker {
        id: ID!
        journeyId: ID!
        title: String!
        place: String!
        description: String!
        date: String!
        longitude: Float!
        latitude: Float!
    }

    input JourneyInput {
        username: String
        title: String
        imageId: String
        description: String
        fromDate: String
        toDate:String
    }
    input MarkerInput {
        journeyId: ID!
        title: String!
        place: String!
        description: String!
        date: String!
        longitude: Float!
        latitude: Float!
    }

    type Query {
        getUserById(id: ID): User!
        getFollowing(id: ID): [User!]!
        getUserComments(id: ID): [Comment!]!
        getParentComments(id: ID): [Comment!]!
        getUserJourneys(id: ID): [Journey!]!
        getJourneys: [Journey!]!
        getJourney(id: ID): Journey!
        getMarkers(journeyId: ID): [Marker!]!
    }

    type Mutation {
        follow(subscriberId: ID, publisherId: ID): [User!]!
        unfollow(subscriberId: ID, publisherId: ID): [User!]!
        createComment(uid: ID, parentId: ID, content: String): Comment!
        createJourney(journey: JourneyInput): Journey
        createMarker(marker: MarkerInput): Marker
    }
`