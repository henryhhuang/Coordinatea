import React, { useState } from 'react';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Container,
    CssBaseline,
    Link,
    Snackbar,
    TextField,
    Typography
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';

import "./SignIn.css"

export function SignIn(props) {

    const { setUsername } = props;
    const [snackbar, setSnackbar] = useState();
    const [open, setOpen] = useState();
    let navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const requestOptions = {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: data.get('username'),
                password: data.get('password'),
            })
        };
        fetch(process.env.NODE_ENV === "production" ? 'https://api.coordinatea.me/signin' : 'http://localhost:5000/signin', requestOptions)
            .then((res) => {
                if (res.ok === 200) {
                    setUsername(data.get('username'))
                    navigate("/");
                } else {
                    return res.text().then((text) => {
                        setErrorSnackbar(text)
                    })
                }
            }).catch((error) => {
                console.log(error)
            });

    }

    const setErrorSnackbar = (message) => {
        const messageJSON = JSON.parse(message)
        setSnackbar(messageJSON.error);
        setOpen(true);
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
                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
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
                        color='primary'
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
                        color='primary'
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        color="primary"
                    >
                        Sign In
                    </Button>
                    <Link href="/signup" variant="body2" color='secondary'>
                        {"Don't have an account? Sign Up"}
                    </Link>
                </Box>
            </Box>
            <Snackbar open={open} onClose={((e) => setOpen(false))} autoHideDuration={6000}>
                <Alert severity="error" sx={{ width: '100%' }}>
                    {snackbar}
                </Alert>
            </Snackbar>
        </Container>
    )
}