import { gql } from '@apollo/client';

export const Journey_Mutations = {
    CREATE_JOURNEY: gql`
        mutation CreateJourney($input: JourneyInput) {
            createJourney(input: $input) {
                username,
                title,
                imageId,
                description,
                fromDate,
                toDate
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
            latitude
        }
    }
    `
}