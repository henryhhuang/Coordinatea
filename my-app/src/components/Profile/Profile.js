import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { Button, Container, Grid, Icon, IconButton, Tab, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Link, useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from 'react';
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import TabPanel from '@mui/lab/TabPanel';
import { format } from 'date-fns'
import EditIcon from '@mui/icons-material/Edit';

const getUserQuery = gql`
  query {
    getUser {
      username
    }
  }
`

const getUserByUsernameQuery = gql`
    query ($username: String) {
        getUserByUsername(username: $username) {
            username
            createdAt
            email
            description
        }
    }
`

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
            username
            parentId
            content
            createdAt
            parent {
                title
                username
            }
        }
    }
`

const updateUserProfileMutation = gql`
        mutation($username: String, $email: String, $description: String) {
            updateProfile(username: $username, email: $email, description: $description) {
                username
                createdAt
                email
                description
            }
        }
    `

const changePasswordMutation = gql`
mutation($username: String, $oldPassword: String, $newPassword: String, $passwordConfirm: String) {
    changePassword(username: $username, oldPassword: $oldPassword, newPassword: $newPassword, passwordConfirm: $passwordConfirm) {
        username
        createdAt
        email
        description
    }
}
`


export function Profile() {
    const { username } = useParams();
    const [userProfile, setUserProfile] = useState({});
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [userJourneys, setUserJourneys] = useState([]);
    const [userComments, setUserComments] = useState([]);
    const [journeyCount, setJourneyCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const [tabValue, setTabValue] = useState("1");
    const [formTab, setFormTab] = useState("1");
    const [edit, setEdit] = useState(false);
    const [followers, setFollowers] = useState([])
    const followerCount = 0


    const [getUserProfile] = useLazyQuery(getUserByUsernameQuery, {
        variables: {
            username: username
        },
        onCompleted: (data) => {
            console.log(data);
            if (data.getUserByUsername)
                setUserProfile(data.getUserByUsername)
        }
    })

    const [getLoggedInUser] = useLazyQuery(getUserQuery, {
        onCompleted: (data) => {
            if (data.getUser)
                setLoggedInUser(data.getUser.username)
        }
    })

    const [getUserJourneys] = useLazyQuery(getUserJourneysQuery, {
        variables: {
            username: username
        },
        onCompleted: (data) => {
            setUserJourneys(data.getUserJourneys);
            setJourneyCount(data.getUserJourneys.length);
        }
    });

    const [getUserComments] = useLazyQuery(getUserCommentsQuery, {
        variables: {
            username: username
        },
        onCompleted: (data) => {
            console.log(data);
            setUserComments(data.getUserComments);
            setCommentCount(data.getUserComments.length);
        }
    });

    var [updateProfile] = useMutation(updateUserProfileMutation, {
        onCompleted: (data) => {
            if (data.updateProfile.username) {
                setUserProfile(data.updateProfile);
                getLoggedInUser();
                setEdit(false);
            }
        }
    })

    var [changePassword] = useMutation(changePasswordMutation, {
        onCompleted: (data) => {
            if (data.changePassword.username) {
                setEdit(false);
            }
        }
    })

    useEffect(() => {
        getUserProfile()
        getLoggedInUser()
        getUserJourneys()
        getUserComments()
    }, [])

    //var { error, loading, data} = useQuery(getUserFollower)

    const handleTabChange = (event, value) => {
        setTabValue(value);
    }

    const handleFormChange = (event, value) => {
        setFormTab(value);
    }

    const handleUpdateProfile = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        try {
            await updateProfile({
                variables: {
                    username: userProfile.username,
                    email: data.get('email'),
                    description: data.get('description')
                }
            })
        } catch (error) {
            console.log(error);
        }

    }

    const hnadleChangePassword = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        try {
            await changePassword({
                variables: {
                    username: userProfile.username,
                    oldPassword: data.get('passwordOld'),
                    newPassword: data.get('password'),
                    passwordConfirm: data.get('passwordConfirm'),
                }
            })
        } catch (error) {
            console.log(error);
        }

    }

    const handleCancel = (event) => {
        event.preventDefault();
        setEdit(false);
    }

    const handleEdit = async (event) => {
        event.preventDefault();
        setEdit(true);
    }


    return (
        <Grid container sx={{ height: '100vh' }}>
            <Grid item xs={4} sx={{ borderRight: 1 }}>
                {!edit ? (

                    <div style={{ padding: '5rem' }}>
                        <Typography align='left' variant="h1" sx={{ mb: 2, fontSize: 64 }}>
                            {userProfile.username ? userProfile.username : "Unnamed"}
                        </Typography>
                        <Typography align='left' variant="body1" sx={{ mb: 1, fontSize: 20 }}>
                            Exploring since {userProfile.createdAt ? format(new Date(userProfile.createdAt), 'yyyy-MM-dd') : "Unknown"}
                        </Typography>
                        <Typography align='left' variant="subtitle2" sx={{ color: '#9e9e9e', ml: 3, mb: 1, fontSize: 20 }}>
                            {userProfile.description ? userProfile.description.length != 0 ? '"' + userProfile.description + '"' : "Nothing to say" : "Nothing to say"}
                        </Typography>
                        <Typography align='left' variant="body1" sx={{ ml: 3, mb: 3, fontSize: 16 }}>~ {userProfile.username} {new Date().getFullYear()} </Typography>
                        <Typography align='left' variant="body1" sx={{ mb: 1, fontSize: 20 }}>
                            Followers: {followerCount}
                        </Typography>
                        <Typography align='left' variant="body1" sx={{ mb: 1, fontSize: 20 }}>
                            Number of Journeys: {journeyCount}
                        </Typography>
                        <Typography align='left' variant="body1" sx={{ mb: 1, fontSize: 20 }}>
                            Number of Comments {commentCount}
                        </Typography>
                        {userProfile.username == loggedInUser ?
                            (<Button
                                variant="contained"
                                sx={{ mt: 2, p: 1, float: 'left' }}
                                color="secondary"
                                onClick={handleEdit}
                            >
                                Edit Profile
                            </Button>) : <></>
                        }
                    </div>) : (
                    <TabContext value={formTab}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleFormChange}>
                                <Tab label="PROFILE" value="1" />
                                <Tab label="PASSWORD" value="2" />
                            </TabList>
                        </Box>
                        <TabPanel value="1" sx={{ height: '90vh', overflow: 'auto' }}>
                            <Box component="form" onSubmit={handleUpdateProfile} xs={4} sx={{ mt: 1 }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    defaultValue={userProfile.email}
                                    color='secondary'
                                    id="email"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                />
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    defaultValue={userProfile.description}
                                    placeholder="Describe yourself..."
                                    multiline
                                    name="description"
                                    rows={2}
                                />
                                <Button
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2, float: 'left' }}
                                    color="secondary"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2, float: 'right' }}
                                    color="secondary"
                                >
                                    Update Profile
                                </Button>
                                { /*
                                <Grid container justify="space-between" >
                                    <Grid item xs={6}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            sx={{ mt: 3, mb: 2, float: 'left' }}
                                            color="secondary"
                                            onClick={handleCancel}
                                        >
                                            Cancel
                                        </Button>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            onClick={handleUpdateProfile}
                                            sx={{ mt: 3, mb: 2, float: 'right' }}
                                            color="secondary"
                                        >
                                            Update Profile
                                        </Button>

                                    </Grid>
                    
                                </Grid>
                                */}
                            </Box>
                        </TabPanel>
                        <TabPanel value="2" sx={{ height: '90vh', overflow: 'auto' }}>
                            <Box component="form" onSubmit={hnadleChangePassword} xs={4} sx={{ mt: 1 }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    placeholder='Old Password'
                                    color='secondary'
                                    name="passwordOld"
                                    type="password"
                                    id="passwordOld"
                                    autoComplete="current-password"
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    placeholder='New Password'
                                    color='secondary'
                                    name="password"
                                    type="password"
                                    id="password"
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    placeholder='Confirm New Password'
                                    color='secondary'
                                    name="passwordConfirm"
                                    type="password"
                                    id="passwordConfirm"
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2, float: 'left' }}
                                    color="secondary"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2, float: 'right' }}
                                    color="secondary"
                                >
                                    Change Password
                                </Button>
                            </Box>
                        </TabPanel>
                    </TabContext>
                )}
            </Grid>
            <Grid item xs={8}>
                <TabContext value={tabValue}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleTabChange}>
                            <Tab label="JOURNEY" value="1" />
                            <Tab label="COMMENTS" value="2" />
                        </TabList>
                    </Box>
                    <TabPanel value="1" sx={{ height: '90vh', overflow: 'auto' }}>
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
                    <TabPanel value="2" sx={{ height: '90vh', overflow: 'auto' }}>
                        {
                            userComments.map((comment) => (
                                <Link to={"../journey/" + comment.parentId} style={{ textDecoration: 'none' }}>
                                    <Card sx={{ m: 3 }}>
                                        <CardContent>
                                            <Typography align="left" variant="body1" sx={{ fontSize: 16 }}>
                                                <Link to={"../profile/" + comment.username} style={{ color: "black", fontWeight: 'bold' }}>{userProfile.username}</Link> commented on <Link to={"../journey/" + comment.parentId} style={{ color: "black", textDecoration: 'none', fontWeight: 'bold' }}>{comment.parent ? comment.parent.title : "unknown"}</Link> posted by <Link to={comment.parent ? "../profile/" + comment.parent.username : "."} style={{ color: "black", fontWeight: 'bold' }}>{comment.parent ? comment.parent.username : "unknown"}</Link>
                                            </Typography>
                                            <Container sx={{ borderLeft: 1, ml: 2 }}>
                                                <Typography align='left' variant="body1" color="text.secondary" sx={{ mt: 2, fontWeight: 'bold' }}>
                                                    {comment.username + " - " + format(new Date(comment.createdAt), 'yyyy-MM-dd')}
                                                </Typography>
                                                <Typography align='left' variant="body1" color="text.secondary" sx={{ fontSize: 20 }}>
                                                    {comment.content}
                                                </Typography>
                                            </Container>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))
                        }
                    </TabPanel>
                </TabContext>
            </Grid>
        </Grid >
    );
}