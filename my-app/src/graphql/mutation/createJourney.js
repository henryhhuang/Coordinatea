import { gql } from '@apollo/client';

export const Mutations = {
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
}