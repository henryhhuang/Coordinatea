
import { Journey } from "../Journey/Journey";
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper';
import {Link} from "react-router-dom";
import mock from './mock.json';

export function Journeys(props) {
    //todos 
    //only let redirect if logged in
    //show followed people's journeys
    //show journeys by popularity, recent, random

    //   const { journeys } = props;
    const journeys = mock;

    return (
    <Stack className="Journeys" direction="row" spacing={2}>
        {journeys.length === 0 ? (
            <Paper>
                No journeys :(.
            </Paper>
        ) : (
        journeys.map((journey, idx) => (
            <Paper>
            <Link to={"journey/" + idx} state={{journey}}>
                <Journey
                    key={`item-idx-${idx}`}
                    journey={journey}
                    />
             </Link>
            </Paper>
        ))
        )}
    </Stack>
    );
}
