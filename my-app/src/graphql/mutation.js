import { gql } from '@apollo/client';

export const Mutations = {
    SIGN_UP: gql`
        mutation Register($registerInput: RegisterInput) {
            register(registerInput: $registerInput) {
                token
                username
            }
        }
    `,
    SIGN_IN: gql`
        mutation Login($loginInput: LoginInput) {
            login(loginInput: $loginInput) {
                token
                username
            }
        }
    `,
    FOLLOW: gql`
        mutation Follow($followInput: FollowInput) {
            follow(followInput: $followInput) {
                username
            }
        }
    `,
    UNFOLLOW: gql`
        mutation Follow($followInput: FollowInput) {
            unfollow(followInput: $followInput) {
                username
            }
        }
    `,
    CREATE_COMMENT: gql`
        mutation createComment($commentInput: CommentInput) {
            createComment(commentInput: $commentInput) {
                username
                createdAt
                content
            }
        }
    `
}