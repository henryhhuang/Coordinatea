import { gql } from '@apollo/client';

export const Journey_Mutations = {
    CREATE_JOURNEY: gql`
        mutation CreateJourney($journey: JourneyInput!) {
            createJourney(journey: $journey) {
                id,
                username,
                title,
                imageId,
                description,
                fromDate,
                toDate,
                suggestionsEnabled
            }
        }
    `,

    CREATE_MARKER: gql`
    mutation createMarker($marker: MarkerInput!) {
        createMarker(marker: $marker) {
            id,
            journeyId,
            title,
            place,
            description,
            date,
            longitude,
            latitude,
            imageId
        }
    }`,
    CREATE_SUGGESTION: gql`
    mutation createSuggestion($suggestion: SuggestionInput!) {
        createSuggestion(suggestion: $suggestion) {
            id,
            markerId,
            description,
            imageId,
            longitude,
            latitude,
            username
        }
    }`,
    DELETE_JOURNEY: gql`
    mutation deleteJourney($journeyId: ID!) {
        deleteJourney(journeyId: $journeyId) {
            id,
            username,
            title,
            imageId,
            description,
            fromDate,
            toDate,
            suggestionsEnabled
        }
    }
    `,
    DELETE_MARKER: gql`
    mutation deleteMarker($markerId: ID!) {
        deleteMarker(markerId: $markerId) {
            id,
            journeyId,
            title,
            place,
            description,
            date,
            longitude,
            latitude,
            imageId
        }
    }
    `,
    DELETE_SUGGESTION: gql`
    mutation deleteSuggestion($suggestionId: ID!) {
        deleteSuggestion(suggestionId: $suggestionId) {
            id,
            markerId,
            description,
            imageId,
            longitude,
            latitude,
            username
        }
    }
    `
}