import { gql } from '@apollo/client';

export const Querys = {
    GET_USER_COMMENTS: gql`
        query GetUserComments($username: String!) {
            getUserComments(username: $username) {
                username
                createdAt
                content
            }
        }
    `
}