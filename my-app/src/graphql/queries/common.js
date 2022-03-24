import { gql } from '@apollo/client';

export const Common_Queries = {
    GET_MAPBOX_KEY: gql`
        query GetMapboxKey {
            getMapboxKey
        }
    `
}