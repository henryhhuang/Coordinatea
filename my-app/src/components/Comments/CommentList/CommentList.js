import { gql, useLazyQuery, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Comment } from '../Comment/Comment';
import { List, ListItem } from '@mui/material';
import { CommentForm } from '../CommentForm/CommentForm';
import Box from '@mui/material/Box';

const getParentCommentsQuery = gql`
    query ($id: ID) {
        getParentComments(id: $id) {
            id
            username
            content
            createdAt
        }
    }
`

export function CommentList(props) {

    const { parentId } = props;

    const [comments, setComments] = useState([]);

    const [getParentComments, { loading, error, data }] = useLazyQuery(getParentCommentsQuery, {
        variables: {
            id: parentId
        },
        onCompleted: (data) => {
            setComments(data.getParentComments);
        }
    })

    useEffect(() => {
        getParentComments()
    }, [])

    return (
        <Box sx={{}}>
            <List sx={{ height: '85vh', overflow: 'auto', width: '100%' }}>
                {comments.map((comment) => (
                    <div key={'list-' + comment.id}>
                        <ListItem divider>
                            <Comment username={comment.username} content={comment.content} createdAt={comment.createdAt} />
                        </ListItem>
                    </div>
                ))}
            </List>
            <CommentForm comments={comments} setComments={setComments} parentId={parentId} />
        </Box>
    )
}