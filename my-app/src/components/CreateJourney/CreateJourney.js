import React, { useEffect, useRef, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Journey_Mutations } from '../../graphql/mutation/journey';
import { useNavigate } from "react-router-dom";
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
import "./CreateJourney.css"

const url = window.location.href;

export function CreateJourney(props) {
 
    const titleRef = useRef(null);
    const descriptionRef = useRef(null);
    const toDateRef = useRef(null);
    const fromDateRef = useRef(null);
    const [image, setImage] = useState();
    const [uploadedImage, setUploadedImage] = useState();
    const [isImageUploaded, setIsImageUploaded] = useState(false);
    const [journey, setJourney] = useState();
    const navigate = useNavigate();

    const [ createJourney, { data, loading, error } ] = useMutation(Journey_Mutations.CREATE_JOURNEY)

    const fileChange = (e) => {
        setImage(e.target.files[0]);
        setIsImageUploaded(true);
    }

    //todo: refactor to a utils folder
    //add a text for the image selected beside the upload file button
    //can also refactor upload button to its own component
    const uploadImage = (file) => {
        const formData = new FormData();
        formData.append('file', file);

        fetch('http://localhost:5000/api/image/0/', {
            method: 'POST',
            credentials: 'include',
            body: formData
        })
        .then((res) => res.json())
        .then((result) => {
            setUploadedImage(result);
        }).catch((error) => {
            console.log('error', error);
        })
    }

    //Send request to save marker once image upload is complete
    useEffect(() => {
        if (journey && uploadedImage) {
            createJourney({
                variables: {
                    journey: {
                        title: journey.title,
                        description: journey.description,
                        imageId: uploadedImage,
                        toDate: journey.toDate,
                        fromDate: journey.fromDate 
                    }
                }
            })
        }
    }, [uploadedImage])

    //Redirect to marker creation once journy is created
    useEffect(() => {
        if (!loading && data) {
            navigate(data.createJourney.id, { replace: true });
        }
    }, [data])

    const onSubmit = (e) => {
        e.preventDefault();
        //todo validation
        let newJourney = {
            title: titleRef.current.value,
            description: descriptionRef.current.value,
            toDate: toDateRef.current.value,
            fromDate: fromDateRef.current.value
        }
        setJourney(newJourney);

        if (isImageUploaded) {
            uploadImage(image);
        }
    };

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
            {/* {loading ? <Loading /> : <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
            </Avatar>} */}
            <Typography component="h1" variant="h5">
                Create a Journey
            </Typography>
            <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    color='secondary'
                    id="title"
                    label="Title"
                    name="title"
                    autoComplete="title"
                    autoFocus
                    inputRef={titleRef}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    color='secondary'
                    id="description"
                    label="Description"
                    name="description"
                    autoComplete="description"
                    autoFocus
                    inputRef={descriptionRef}

                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    color='secondary'
                    name="fromdate"
                    label="From Date"
                    id="fromdate"
                    inputRef={fromDateRef}

                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    color='secondary'
                    id="todate"
                    label="To Date"
                    name="todate"
                    autoFocus
                    inputRef={toDateRef}

                />
                {/* {error ? <Typography component="p" variant="p" sx={{ mt: 2, color: 'red' }}>
                    {error.message}
                </Typography> : <></>} */}
                <Button
                    variant="contained"
                    component="label"
                    >
                    Upload File
                    <input
                        type="file"
                        hidden
                        onChange={fileChange}
                />
            </Button>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    color="secondary"
                >
                    Create Journey
                </Button>
            </Box>
        </Box>
    </Container>
    );
}