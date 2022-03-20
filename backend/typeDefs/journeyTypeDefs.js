
const { gql } = require('apollo-server-express')
const journeyTypeDefs = gql`
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
        username: String!
        title: String!
        imageId: String!
        description: String!
        fromDate: String!
        toDate: String!
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

    extend type Query {
        getJourneys: [Journey!]!
        getJourney(id: ID): Journey!
        getMarkers(journeyId: ID): [Marker!]!
    }

    extend type Mutation {
        createJourney(journey: JourneyInput): Journey
        createMarker(marker: MarkerInput): Marker
    }
`

module.exports = journeyTypeDefs;
