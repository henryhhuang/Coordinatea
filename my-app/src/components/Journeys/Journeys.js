
import { Journey } from "../Journey/Journey";
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper';
import {Link} from "react-router-dom";
import mock from './mock.json';
import { useQuery } from '@apollo/client'
import { Journey_Querys } from '../../graphql/queries/journey'
import { useEffect, useState } from "react";
export function Journeys(props) {
    const {loading, error, data} = useQuery(Journey_Querys.GET_JOURNEYS);
    const [journeys, setJourneys] = useState([]);

    //possible features todo: show journeys by popularity, random, by place?
    useEffect(() => {
        if (!loading) {
            setJourneys(data.getJourneys)
        }
    }, [data])

    return (
    <Stack className="Journeys" direction="row" spacing={2}>
        {journeys.length === 0 ? (
            <Paper>
                No journeys :(.
            </Paper>
        ) : (
        journeys.map((journey) => (
            <Paper>
            <Link to={"journey/" + journey.id} state={{journey}}>
                <Journey
                    key={`journey-id-${journey.id}`}
                    journey={journey}
                    />
             </Link>
            </Paper>
        ))
        )}
    </Stack>
    );
}
