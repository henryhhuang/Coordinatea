import React from 'react';
import { useMutation } from '@apollo/client';
import { Mutations } from '../../../graphql/mutation';
import { useAuthToken } from '../../../util/authentication';
import {
    Avatar,
    Grid,
    Button,
    Container,
    TextField,
    IconButton
} from '@mui/material';

import SendIcon from '@mui/icons-material/Send';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


export function CommentForm() {

    const [createComment, { data, loading, error }] = useMutation(Mutations.CREATE_COMMENT, {
        onCompleted: (data) => {
            console.log(data);
        },
        onError: (error) => {
            console.log(error.message);
        }
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        try {
            createComment({
                variables: {
                    commentInput: {
                        content: data.get('content')
                    }
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Container maxWidth="md" component='form' onSubmit={handleSubmit}>
            <Grid container spacing={1}>
                <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <AccountCircleIcon />
                    </Avatar>
                </Grid>
                <Grid item xs={10} sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        color='secondary'
                        id="content"
                        placeholder='Write something...'
                        name="content"
                        autoComplete="content"
                        autoFocus
                    />
                </Grid>
                <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        color="secondary"
                    ><SendIcon/></IconButton>
                </Grid>
            </Grid>
        </Container>
    )
}