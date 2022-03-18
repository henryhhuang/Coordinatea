import { gql } from '@apollo/client';

//TODO PAGINATION
export const Journey_Querys = {
    GET_JOURNEYS: gql`
        query GetJourneys {
            getJourneys {
                id,
                username,
                title,
                imageId,
                description,
                fromDate,
                toDate
            }
        }
    `,
    GET_MARKERS: gql`
        query GetMarkers($journeyId: ID!) {
            getMarkers(journeyId: $journeyId) {
                id,
                journeyId,
                title,
                place,
                description,
                date,
                longitude,
                latitude,
            }

        }
    `
}