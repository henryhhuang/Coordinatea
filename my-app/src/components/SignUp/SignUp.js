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
    Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import "./SignUp.css"

export function SignUp(props) {
    const { setUsername } = props;
    const [snackbar, setSnackbar] = useState();
    const [open, setOpen] = useState();

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
                    navigate("/");
                } else {
                    return res.text().then((text) => {
                        setErrorSnackbar(text)
                    })
                }
            })
        } catch (err) {
        }
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
                    Sign Up
                </Typography>
                <Box component="form" onSubmit={handleSubmit} afterSubmit={() => navigate("/")} noValidate sx={{ mt: 1 }}>
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
                        color='primary'
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
                        color='primary'
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
                        color="primary"
                    >
                        Sign Up
                    </Button>
                    <Link href="/signin" variant="body2" color='secondary'>
                        {"Already have an account? Sign In"}
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