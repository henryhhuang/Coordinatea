import React from 'react';
import { useMutation } from '@apollo/client';
import { useAuthToken } from '../../util/authentication';
import { Loading } from '../Loading/Loading'
import { Mutations } from '../../graphql/mutation';
import {
    Avatar,
    Box,
    Button,
    Container,
    CssBaseline,
    Link,
    TextField,
    Typography,
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import "./SignUp.css"

export function SignUp() {

    const [_, setAuthToken] = useAuthToken();

    const [registerUser, { data, loading, error }] = useMutation(Mutations.SIGN_UP, {
        onCompleted: (data) => {
            console.log(data);
            setAuthToken(data.register.token);
        },
        onError: (error) => {
            console.log(error.message);
        }
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        try {
            registerUser({
                variables: {
                    registerInput: {
                        username: data.get('username'),
                        password: data.get('password'),
                        passwordConfirm: data.get('passwordConfirm'),
                        email: data.get('email')
                    }
                }
            });
        } catch (err) {
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
                {loading ? <Loading /> : <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>}
                <Typography component="h1" variant="h5">
                    Sign Up
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
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
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
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        color='secondary'
                        id="passwordConfirm"
                        type="password"
                        label="Confirm Password"
                        name="passwordConfirm"
                        autoFocus
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
                        Sign Up
                    </Button>
                    <Link href="#" variant="body2" color='secondary'>
                        {"Already have an account? Sign In"}
                    </Link>
                </Box>
            </Box>
        </Container>
    )
}