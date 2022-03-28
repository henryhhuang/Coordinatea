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
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { uploadImage } from '../../api.mjs';
import { Switch } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import "./CreateJourney.css"

const url = window.location.href;

export function CreateJourney(props) {

    const titleRef = useRef(null);
    const descriptionRef = useRef(null);
    const [fromDate, setFromDate] = useState();
    const [toDate, setToDate] = useState();
    const [image, setImage] = useState();
    const [uploadedImage, setUploadedImage] = useState();
    const [isImageUploaded, setIsImageUploaded] = useState(false);
    const [journey, setJourney] = useState();
    const [formError, setFormError] = useState(false);
    const [suggestionsEnabled, setSuggestionsEnabled] = useState(true);
    const navigate = useNavigate();

    const [createJourney, { data, loading, error }] = useMutation(Journey_Mutations.CREATE_JOURNEY)

    const fileChange = (e) => {
        setImage(e.target.files[0]);
        setIsImageUploaded(true);
    }

    //Send request to save journey once image upload is complete
    useEffect(() => {
        if (journey && uploadedImage) {
            createJourney({
                variables: {
                    journey: {
                        title: journey.title,
                        description: journey.description,
                        imageId: uploadedImage,
                        toDate: journey.toDate,
                        fromDate: journey.fromDate,
                        suggestionsEnabled
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

    const handleChange = (event) => {
        setSuggestionsEnabled(event.target.checked);
      };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!(isImageUploaded && titleRef.current.value && descriptionRef.current.value)) {
            setFormError(true);
            return;
        }
        setFormError(false);
        let newJourney = {
            title: titleRef.current.value,
            description: descriptionRef.current.value,
            toDate: toDate,
            fromDate: fromDate
        }
        setJourney(newJourney);
        uploadImage(image, setUploadedImage);
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
                    <div className='dates'>
                        <LocalizationProvider className="fromDate" dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Pick your start date"
                                value={fromDate}
                                onChange={(newValue) => {
                                    setFromDate(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </div>
                    <div className="dates">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Pick your end date"
                                value={toDate}
                                onChange={(newValue) => {
                                    setToDate(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </div>
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
                    <div>
                        <FormControlLabel onChange={handleChange} control={<Switch defaultChecked />} label="Viewer Suggestions"></FormControlLabel>
                    </div>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        color="secondary"
                    >
                        Create Journey
                    </Button>
                     {formError ? <Typography component="p" variant="p" sx={{ mt: 2, color: 'red' }}>
                        A title, description, dates and image are required.
                    </Typography> : <></>}
                </Box>
            </Box>
        </Container>
    );
}