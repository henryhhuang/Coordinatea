import { gql, useLazyQuery, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Comment } from '../Comment/Comment';
import { List, ListItem } from '@mui/material';
import { CommentForm } from '../CommentForm/CommentForm';

const getParentCommentsQuery = gql`
    query ($id: ID) {
        getParentComments(id: $id) {
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
        <div style={{ width: '100%' }}>
            <List sx={{ height: '700px', overflow: 'auto', width: '100%', bgcolor: 'background.paper' }}>
                {comments.map((comment) => (
                    <ListItem sx={{ bb: 'black' }}>
                        <Comment username={comment.username} content={comment.content} createdAt={comment.createdAt} />
                    </ListItem>
                ))}
            </List>
            <CommentForm comments={comments} setComments={setComments} parentId={parentId} />
        </div>
    )
}