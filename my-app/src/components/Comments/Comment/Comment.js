import React from 'react';
import { Avatar, Container, CssBaseline, Grid, IconButton, Typography } from '@mui/material'
import ReplyIcon from '@mui/icons-material/Reply';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export function Comment(props) {
    const { username, content, createdAt } = props

    return (
        <Container component="main" maxWidth="md" sx={{mt: 1}}>
            <Grid container spacing={1}>
                <CssBaseline />
                <Grid item >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <AccountCircleIcon />
                    </Avatar>
                </Grid>
                <Grid item xs={10}>
                    <Grid container spacing={1}>
                        <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography align='left' variant='h6' sx={{ fontSize: 16, fontWeight: 'bold' }}>
                                {username}
                            </Typography>
                        </Grid>
                        <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography align='left' variant='h6' sx={{ color: '#9e9e9e', fontSize: 12 }}>
                                1 minute ago
                            </Typography>
                        </Grid>
                    </Grid>
                    <Typography align='left' sx={{ mt: 1, fontSize: 16 }}>
                        {content}
                    </Typography>
                    <Grid container spacing={1}>
                        <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton align='left'>
                                <ThumbUpIcon> Reply </ThumbUpIcon>
                            </IconButton>
                        </Grid>
                        <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton align='left'>
                                <ThumbDownAltIcon> Reply </ThumbDownAltIcon>
                            </IconButton>
                        </Grid>
                        <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton align='left'>
                                <ReplyIcon> Reply </ReplyIcon>
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    )
}