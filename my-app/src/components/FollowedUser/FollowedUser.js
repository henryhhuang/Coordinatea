import { gql, useLazyQuery, useMutation } from "@apollo/client";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { IconButton, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { Journey } from "../Journey/Journey";

const getUserJourneysQuery = gql`
    query ($username: String) {
        getUserJourneys(username: $username) {
            id,
            username,
            title,
            imageId,
            description,
            fromDate,
            toDate,
            suggestionsEnabled,
            journeyType
        }
    }
`

const unfollowMutation = gql`
    mutation ($subscriberUsername: String, $publisherUsername: String) {
        unfollow(subscriberUsername: $subscriberUsername, publisherUsername: $publisherUsername) {
            username
        }
    }
`


export function FollowedUser(props) {
    /*
        get the logged In user journeys
        expose unfollow
    */

    const { username, loggedInUser, getFollowing } = props
    const [userJourneys, setUserJourneys] = useState([]);

    const [getUserJourneys] = useLazyQuery(getUserJourneysQuery, {
        variables: {
            username: username
        },
        onCompleted: (data) => {
            console.log(data);
            setUserJourneys(data.getUserJourneys);
        }
    });

    const [unfollowUser] = useMutation(unfollowMutation, {
        onCompleted: (data) => {
            getFollowing();
        }
    })

    const handleUnfollow = async (event) => {
        event.preventDefault();
        console.log('unfollowing')
        unfollowUser({
            variables: {
                subscriberUsername: loggedInUser,
                publisherUsername: username
            }
        })
    }

    useEffect(() => {
        getUserJourneys()
    }, [])

    return (
        <div style={{ height: '50vh', display: 'flex' }}>
            <div style={{ width: '20vw', display: 'flex', alignItems: 'center', borderRight: '1px black solid' }}>
                <Link to={"../profile/" + username} style={{ textDecoration: 'none', }}>
                    <Typography align='left' sx={{ color: 'black', fontWeight: 'bold', fontSize: 32 }}>
                        {username}
                    </Typography>
                </Link>
                <IconButton>
                    <FavoriteIcon onClick={handleUnfollow} />
                </IconButton>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', height: '50vh', overflow: 'auto' }} >
                {
                    userJourneys.length > 0 ?
                        (
                            <div>
                                {
                                    userJourneys.map((journey) => (
                                        <div style={{ marginTop: '2vh', marginBottom: '2vh', width: "80vw" }}>
                                            <Link key={`link-id-${journey.id}`} className="link" to={"../../journey/" + journey.id} state={{ journey }}>
                                                <Journey
                                                    key={`journey-id-${journey.id}`}
                                                    username={loggedInUser}
                                                    journey={journey}
                                                    removeJourney={(e) => { return }}
                                                />
                                            </Link>
                                        </div>
                                    ))
                                }
                            </div>
                        )
                        :
                        (<div style={{ width: "80vw", display: "flex", justifyContent: 'center' }}>
                            <h1>No journeys posted by {username} </h1>
                        </div>
                        )
                }
            </div>
        </div >
    )
}