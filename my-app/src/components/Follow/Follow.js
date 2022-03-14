import React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { gql, useMutation } from '@apollo/client';
import { Mutations } from '../../graphql/mutation';

export function Follow() {

    const [followUser, {data, loading, error}] = useMutation(Mutations.FOLLOW, {
        onCompleted: (data) => {
            console.log(data);
        }
    })

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            subscriber: data.get('subscriber'),
            publisher: data.get('publisher'),
        });
        followUser({
            variables: {
                followInput: {
                    subscriberUsername: data.get('subscriber'),
                    publisherUsername: data.get('publisher'),
                }
            }
        });
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Follow
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        color='secondary'
                        id="subscriber"
                        label="Subscriber"
                        name="subscriber"
                        autoComplete="subscriber"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        color='secondary'
                        name="publisher"
                        label="Publisher"
                        id="publisher"
                        autoComplete="publisher"
                    />
                    {/*<FormControlLabel
                        control={<Checkbox value="remember" color="secondary" />}
                        label="Remember me"
                    />*/}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        color="secondary"
                    >
                        Follow
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}