import React from 'react';
import { Avatar, Container, CssBaseline, Grid, IconButton, Typography } from '@mui/material'
import ReplyIcon from '@mui/icons-material/Reply';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const intervals = {
    year: 60 * 60 * 24 * 365,
    month: 60 * 60 * 24 * 30,
    week: 60 * 60 * 24 * 7,
    day: 60 * 60 * 24,
    hour: 60 * 60,
    minute: 60
}

function commentAge(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds === 0)
        return "just now"
    if (seconds / intervals.year > 1)
        return `${Math.floor(seconds / intervals.year)} years ago`;
    if (seconds / intervals.month > 1)
        return `${Math.floor(seconds / intervals.month)} months ago`;
    if (seconds / intervals.week > 1)
        return `${Math.floor(seconds / intervals.week)} weeks ago`;
    if (seconds / intervals.day > 1)
        return `${Math.floor(seconds / intervals.day)} days ago`;
    if (seconds / intervals.hour > 1)
        return `${Math.floor(seconds / intervals.hour)} hours ago`;
    if (seconds / intervals.minute > 1)
        return `${Math.floor(seconds / intervals.minute)} minutes ago`;
    return `${seconds} seconds ago`;
}

export function Comment(props) {
    const { username, content, createdAt } = props

    return (
        <Container component="main" maxWidth="md" sx={{ mt: 1 }}>
            <Grid container spacing={1}>
                <CssBaseline />
                <Grid item xs={10}>
                    <Grid container spacing={1}>
                        <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography align='left' variant='h6' sx={{ fontSize: 16, fontWeight: 'bold' }}>
                                {username}
                            </Typography>
                        </Grid>
                        <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography align='left' variant='h6' sx={{ color: '#9e9e9e', fontSize: 12 }}>
                                {commentAge(new Date(createdAt))}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Typography align='left' sx={{ mt: 1, fontSize: 16 }}>
                        {content}
                    </Typography>
                    {/*
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
                    */}
                </Grid>
            </Grid>
        </Container>
    )
}