import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Querys } from '../../../graphql/query'

export function CommentList(props) {
    const { username } = props;

    const { data, loading, error } = useQuery(Querys.GET_USER_COMMENTS, {
        variables: { username: username },
        onCompleted: (data) => {
            console.log(data);
        },
        onError: (error) => {
            console.log(error)
        }
    });

    return (
        <div>

        </div>
    )
}