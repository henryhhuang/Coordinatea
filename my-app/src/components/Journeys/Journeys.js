
import { Journey } from "../Journey/Journey";
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid'
import {Link} from "react-router-dom";
import { useQuery } from '@apollo/client'
import { Journey_Querys } from '../../graphql/queries/journey'
import { useEffect, useState } from "react";
import "./Journeys.css"

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

    <Grid container justify="center" className="journeys" spacing={2}>
        {journeys.length === 0 ? (
            <Paper>
                No journeys :(.
            </Paper>
        ) : (
        journeys.map((journey) => (
            <Grid key={`grid-id-${journey.id}`} item xs={12} sm={6} md={4}>
                <Link key={`link-id-${journey.id}`} className="link" to={"journey/" + journey.id} state={{journey}}>
                    <Journey
                        key={`journey-id-${journey.id}`}
                        journey={journey}
                        />
                </Link>
            </Grid>
        ))
        )}
    </Grid>
    );
}
