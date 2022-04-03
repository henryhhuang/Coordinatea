import { gql } from '@apollo/client';

export const Suggestion_Queries = {
    GET_PLACE_SUGGESTIONS: gql`
        query GetPlaceSuggestions($place: PlaceInput!) {
            getPlaceSuggestions(place: $place) {
                xid,
                name,
                distance,
                type,
                longitude,
                latitude
            }
        }
    `
}