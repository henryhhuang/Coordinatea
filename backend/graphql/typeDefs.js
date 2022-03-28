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
        parentId: ID
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
        imageId: ID!
        title: String!
        place: String!
        description: String!
        date: String!
        longitude: Float!
        latitude: Float!
    }

    input JourneyInput {
        title: String!
        imageId: ID!
        description: String!
        fromDate: String!
        toDate:String!
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

    type Query {
        getUser: User
        getUserById(id: ID): User!
        getUserByUsername(username: String): User!
        getFollowing(id: ID): [User!]!
        getUserComments(username: String): [Comment!]!
        getParentComments(id: ID): [Comment!]!
        getUserJourneys(username: String): [Journey!]!
        getJourneys: [Journey!]!
        getJourney(id: ID): Journey!
        getMarkers(journeyId: ID): [Marker!]!
        getMapboxKey: String!
    }

    type Mutation {
        follow(subscriberId: ID, publisherId: ID): [User!]!
        unfollow(subscriberId: ID, publisherId: ID): [User!]!
        createComment(parentId: ID, content: String): Comment!
        createJourney(journey: JourneyInput): Journey
        createMarker(marker: MarkerInput): Marker
    }
`