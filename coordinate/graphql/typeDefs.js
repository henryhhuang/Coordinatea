const { gql } = require('apollo-server');

module.exports = gql`
    type User {
        id: ID!
        username: String!
        token: String
        email: String!
        createdAt: String!
        following: [User]!
    }
    type Comment {
        id: ID!
        username: String!
        createdAt: String!
        content: String!
        replies: [Comment]!
    }
    type Journey {
        id: ID!
        owner: User!
        createdAt: String!
    }

    input RegisterInput {
        username: String!
        password: String!
        passwordConfirm: String!
        email: String!
    }
    input LoginInput {
        username: String!
        password: String!
    }
    input FollowInput {
        subscriberUsername: String
        publisherUsername: String
    }
    input CommentInput {
        content: String!
    }
    
    type Query {
        getUser(username: String!): User
        getFollowing(username: String!): [User]!
        getUserComments(username: String!): [Comment]!
        getCommentComments(id: ID!): [Comment]!
    }

    type Mutation {
        register(registerInput: RegisterInput): User!
        login(loginInput: LoginInput): User!
        follow(followInput: FollowInput): [User]!
        unfollow(followInput: FollowInput): [User]!
        createComment(commentInput: CommentInput): Comment!
    }
`