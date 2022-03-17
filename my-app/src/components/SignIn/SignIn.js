import React from 'react';
import { useMutation } from '@apollo/client';
import { Mutations } from '../../graphql/mutation';
import { useAuthToken } from '../../util/authentication';
import {
    Avatar,
    Box,
    Button,
    Container,
    CssBaseline,
    Link,
    TextField,
    Typography
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import "./SignIn.css"

export function SignIn() {

    const [_, setAuthToken, removeAuthToken] = useAuthToken();
    const [loginUser, { data, loading, error }] = useMutation(Mutations.SIGN_IN, {
        onCompleted: (data) => {
            console.log(data);
            setAuthToken(data.login.token);
        },
        onError: (error) => {
            console.log(error.message);
        }
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        try {
            const requestOptions = {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: data.get('username'),
                    password: data.get('password'),
                })
            };
            fetch('http://localhost:5000/signin', requestOptions).then(res => console.log(res))
        } catch (error) {
            console.log(error);
        }
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
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        color='secondary'
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        color='secondary'
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    {error ? <Typography component="p" variant="p" sx={{ mt: 2, color: 'red' }}>
                        {error.message}
                    </Typography> : <></>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        color="secondary"
                    >
                        Sign In
                    </Button>
                    <Link href="#" variant="body2" color='secondary'>
                        {"Don't have an account? Sign Up"}
                    </Link>
                </Box>
            </Box>
        </Container>
    )
}