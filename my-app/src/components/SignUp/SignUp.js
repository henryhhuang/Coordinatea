import React from 'react';
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
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import "./SignUp.css"

export function SignUp(props) {

    const { setUsername } = props;

    let navigate = useNavigate()

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
                    email: data.get('email'),
                    password: data.get('password'),
                    passwordConfirm: data.get('passwordConfirm')
                })
            };
            fetch(process.env.NODE_ENV === "production" ? 'https://api.coordinatea.me/signup' : 'http://localhost:5000/signup', requestOptions).then(res => {
                if (res.status === 200) {
                    setUsername(data.get('username'))
                    navigate(-1);
                }
            })
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
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign Up
                </Typography>
                <Box component="form" onSubmit={handleSubmit} afterSubmit={() => navigate("/")} noValidate sx={{ mt: 1 }}>
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
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        color="secondary"
                    >
                        Sign Up
                    </Button>
                    <Link href="/signin" variant="body2" color='secondary'>
                        {"Already have an account? Sign In"}
                    </Link>
                </Box>
            </Box>
        </Container>
    )
}