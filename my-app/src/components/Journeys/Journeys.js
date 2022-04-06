
import { Journey } from "../Journey/Journey";
import Paper from '@mui/material/Paper';
import { Link } from "react-router-dom";
import { useLazyQuery, useMutation } from '@apollo/client'
import { Journey_Querys } from '../../graphql/queries/journey'
import { Journey_Mutations } from "../../graphql/mutation/journey";
import { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import { Pagination } from "@mui/material";
import "./Journeys.css"

export function Journeys(props) {
    const { username } = props;
    const [journeys, setJourneys] = useState([]);
    const [length, setLength] = useState(0);
    const [page, setPage] = useState(1);

    const [getJourneysLength] = useLazyQuery(Journey_Querys.GET_JOURNEYS_LENGTH, {
        onCompleted: data => {
            setLength(data.getJourneysLength)
            getJourneys()
        }
    });

    const [getJourneys] = useLazyQuery(Journey_Querys.GET_JOURNEYS, {
        variables: {
            page: page - 1
        },
        onCompleted: data => {
            setJourneys(data.getJourneys)
        }
    });

    const [deleteJourney] = useMutation(Journey_Mutations.DELETE_JOURNEY, {
        onCompleted: data => {
            if (length % 10 == 1) {
                setPage(page - 1);
            }
            getJourneysLength();
        },
        onError: error => {
            console.log(error)
        }
    })


    useEffect(() => {
        getJourneysLength();
    }, [])

    useEffect(() => {
        getJourneys();
    }, [page])

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
            {journeys.length === 0 ? (
                <Paper>
                    No journeys :(.
                </Paper>
            ) : (
                journeys.map((journey) => (
                    <Link key={`link-id-${journey.id}`} className="link" to={"journey/" + journey.id} state={{ journey }}>
                        <Journey
                            key={`journey-id-${journey.id}`}
                            username={username}
                            journey={journey}
                            removeJourney={removeJourney}
                        />
                    </Link>
                ))
            )}
            <Pagination sx={{ margin: "auto", display: "flex", justifyContent: "center" }} count={Math.ceil(length / 10)} color="primary" shape="rounded" onChange={handlePagination} />
        </Stack>
    );
}
