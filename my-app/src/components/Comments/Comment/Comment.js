import React from 'react';
import { Avatar, Container, CssBaseline, Grid, IconButton, Typography } from '@mui/material'
import ReplyIcon from '@mui/icons-material/Reply';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

const intervals = {
    year: 60 * 60 * 24 * 365,
    month: 60 * 60 * 24 * 30,
    week: 60 * 60 * 24 * 7,
    day: 60 * 60 * 24,
    hour: 60 * 60,
    minute: 60
}

/*
Citation:
https://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site
*/
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
    const { username, content, owner, createdAt, id, removeComment } = props

    return (
        <Container component="main" maxWidth="md">
            <Grid container spacing={1}>
                <CssBaseline />
                <Grid item xs={10}>
                    <Grid container spacing={1}>
                        <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography align='left' variant='body1' sx={{ fontSize: 16, fontWeight: 'bold', color: 'black', textDecoration: 'none' }}>
                                <Link style={{ color: 'black' }} to={"../../profile/" + username}>{username}</Link>
                            </Typography>
                        </Grid>
                        <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography align='left' variant='body2' sx={{ color: '#9e9e9e', fontSize: 12 }}>
                                {commentAge(new Date(createdAt))}
                            </Typography>
                        </Grid>
                        {
                            owner &&
                            <IconButton onClick={((e) => {
                                e.preventDefault()
                                removeComment(id)
                            })} aria-label="delete">
                                <DeleteIcon />
                            </IconButton>
                        }
                    </Grid>
                    <Typography align='left' variant='body1' sx={{ borderLeft: 1, ml: 2, p: 2, fontSize: 20 }}>
                        {content}
                    </Typography>

                </Grid>
            </Grid>
        </Container>
    )
}