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
        username: String
        createdAt: String
    }
`