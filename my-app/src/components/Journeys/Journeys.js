
import { Journey } from "../Journey/Journey";
import Paper from '@mui/material/Paper';
import {Link} from "react-router-dom";
import { useLazyQuery, useMutation} from '@apollo/client'
import { Journey_Querys } from '../../graphql/queries/journey'
import { Journey_Mutations } from "../../graphql/mutation/journey";
import { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import { Pagination } from "@mui/material";
import "./Journeys.css"

export function Journeys(props) {
    const { username } = props;
    const [getJourneysLength, {loading: lengthLoading, error: lengthError, data: lengthData}] = useLazyQuery(Journey_Querys.GET_JOURNEYS_LENGTH);
    const [journeys, setJourneys] = useState([]);
    const [length, setLength] = useState(0);
    const [page, setPage] = useState(1);

    const [getJourneys, {loading, error, data}] = useLazyQuery(Journey_Querys.GET_JOURNEYS, {
        variables: {
            page: page - 1
        }
    });

    const [deleteJourney, { loading: deleteLoading, error: deleteError, data: deleteData }] = useMutation(Journey_Mutations.DELETE_JOURNEY)

    useEffect(() => {
        getJourneysLength();
    }, [])

    useEffect(() => {
        if (!lengthLoading && lengthData) {
            setLength(lengthData.getJourneysLength);
            if (lengthData.getJourneysLength == 10 && page != 1) {
                setPage(page - 1);
            } else {
                getJourneys();
            }
        }
    }, [lengthData])
    

    useEffect(() => {
        if (!loading && data) {
            setJourneys(data.getJourneys)
        }
    }, [data])

    useEffect(() => {
        getJourneys();
    }, [page])

    useEffect(() => {
        if (!deleteLoading && deleteData) {
            getJourneysLength();
        }
    }, [deleteData])

    const handlePagination = (e, value) => {
        e.preventDefault();
        setPage(value);
    }

    const removeJourney = (journeyId) => {
        deleteJourney({
            variables: {
                journeyId
            }
        })
    }
    

    return (
    <Stack justify="center" className="journeys" spacing={2}>
        <Pagination sx={{margin: "auto"}} count={Math.ceil(length / 10)} color="primary" shape="rounded" onChange={handlePagination}/>
        {journeys.length === 0 ? (
            <Paper>
                No journeys :(.
            </Paper>
        ) : (
        journeys.map((journey) => (
            <Link key={`link-id-${journey.id}`} className="link" to={"journey/" + journey.id} state={{journey}}>
                <Journey
                    key={`journey-id-${journey.id}`}
                    username={username}
                    journey={journey}
                    removeJourney={removeJourney}
                    />
            </Link>
        ))
        )}
    </Stack>    
    );
}
