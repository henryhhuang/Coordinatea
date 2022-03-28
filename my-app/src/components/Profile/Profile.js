import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { Grid, Tab, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Link, useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from 'react';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import TabPanel from '@mui/lab/TabPanel';
import { format } from 'date-fns'


const getUserJourneysQuery = gql`
    query ($username: String) {
        getUserJourneys(username: $username) {
            id
            title
            description
            fromDate
            toDate
        }
    }
`

const getUserCommentsQuery = gql`
    query ($username: String) {
        getUserComments(username: $username) {
            parentId
            content
            createdAt
        }
    }
`

export function Profile() {
    const { username } = useParams();
    const [tabValue, setTabValue] = useState("1");

    const [userJourneys, setUserJourneys] = useState([]);
    const [userComments, setUserComments] = useState([]);

    var [getUserJourneys, { error, loading, data }] = useLazyQuery(getUserJourneysQuery, {
        variables: {
            username: username
        },
        onCompleted: (data) => {
            console.log(data);
            setUserJourneys(data.getUserJourneys);
        }
    });

    var [getUserComments, { error, loading, data }] = useLazyQuery(getUserCommentsQuery, {
        variables: {
            username: username
        },
        onCompleted: (data) => {
            console.log(data);
            setUserComments(data.getUserComments);
        }
    });

    useEffect(() => {
        getUserJourneys();
    }, []);

    useEffect(() => {
        getUserComments();
    }, [])

    const handleTabChange = (event, value) => {
        setTabValue(value);
    }

    return (
        <Grid container sx={{ height: '90vh' }}>
            <Grid item xs={4} sx={{ background: 'blue' }}>

                <h1></h1>
            </Grid>
            <Grid item xs={8}>
                <TabContext value={tabValue}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleTabChange}>
                            <Tab label="JOURNEY" value="1" />
                            <Tab label="COMMENTS" value="2" />
                        </TabList>
                    </Box>
                    <TabPanel value="1" sx={{ height: '80vh', overflow: 'auto' }}>
                        {
                            userJourneys.map((journey) => (
                                <Link to={"../journey/" + journey.id}>
                                    <Card sx={{ m: 3 }}>
                                        <CardHeader titleTypographyProps={{ variant: 'h6', align: 'left' }}
                                            subheaderTypographyProps={{ variant: 'body2', align: 'left' }}
                                            title={journey.title}
                                            subheader={format(new Date(journey.fromDate * 1), 'yyyy-MM-dd') + ' to ' + format(new Date(journey.toDate * 1), 'yyyy-MM-dd')} />
                                        <CardContent>
                                            <Typography align='left' variant="body1" color="text.secondary">
                                                {journey.description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))
                        }
                    </TabPanel>
                    <TabPanel value="2" sx={{ height: '80vh', overflow: 'auto' }}>
                        {
                            userComments.map((comment) => (
                                <Link to={"../journey/" + comment.parentId}>
                                    <Card sx={{ m: 3 }}>
                                        <CardHeader titleTypographyProps={{ variant: 'h6', align: 'left' }}
                                            subheaderTypographyProps={{ variant: 'body2', align: 'left' }}
                                            title={comment.content}
                                            subheader={format(new Date(comment.createdAt), 'yyyy-MM-dd')} />
                                        <CardContent>
                                            <Typography align='left' variant="body1" color="text.secondary">
                                                {comment.content}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))
                        }
                    </TabPanel>
                </TabContext>
            </Grid>
        </Grid>
    );
}