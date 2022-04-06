import React, { useEffect, useRef, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Journey_Mutations } from '../../graphql/mutation/journey';
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, CssBaseline, TextField, Typography } from '@mui/material'
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { uploadImage } from '../../api.mjs';
import { Switch } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function PlanJourney() {
    const titleRef = useRef(null);
    const descriptionRef = useRef(null);
    const [fromDate, setFromDate] = useState();
    const [toDate, setToDate] = useState();
    const [image, setImage] = useState();
    const [uploadedImage, setUploadedImage] = useState();
    const [isImageUploaded, setIsImageUploaded] = useState(false);
    const [journey, setJourney] = useState();
    const [suggestionsEnabled, setSuggestionsEnabled] = useState(true);
    const [isPublic, setIsPublic] = useState(true);
    const [open, setOpen] = useState();
    const [snackbar, setSnackbar] = useState();

    const navigate = useNavigate();

    const fileChange = (e) => {
        setImage(e.target.files[0]);
        setIsImageUploaded(true);
    }

    const [createJourney, { data, loading, error }] = useMutation(Journey_Mutations.CREATE_JOURNEY, {
        onCompleted: data => navigate(data.createJourney.id, { replace: true }),
        onError: error => setErrorSnackbar(error.message)
    })

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
                        suggestionsEnabled,
                        isPublic
                    }
                }
            })
        }
    }, [uploadedImage])

    useEffect(() => {
        if (journey && journey.imageId === "") {
            createJourney({
                variables: {
                    journey: {
                        title: journey.title,
                        description: journey.description,
                        imageId: journey.imageId,
                        toDate: journey.toDate,
                        fromDate: journey.fromDate,
                        suggestionsEnabled,
                        isPublic
                    }
                }
            })
        }
    }, [journey])

    const setErrorSnackbar = (message) => {
        setSnackbar(message);
        setOpen(true);
    }

    const handleChange = (event, value) => {
        if (value === "suggestions") {
            setSuggestionsEnabled(event.target.checked);
        } else {
            setIsPublic(event.target.checked);
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!titleRef.current.value || !descriptionRef.current.value) {
            setSnackbar("A title, description, dates and image are required")
            setOpen(true);
            return;
        }

        if (isImageUploaded) {
            uploadImage(image, setUploadedImage, setErrorSnackbar);
        } else {
            let newJourney = {
                title: titleRef.current.value,
                description: descriptionRef.current.value,
                imageId: "",
                toDate: toDate,
                fromDate: fromDate
            }
            setJourney(newJourney);
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
                <Typography component="h1" variant="h5">
                    Plan a Journey
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
                        <FormControlLabel onChange={((e) => handleChange(e, "suggestions"))} control={<Switch defaultChecked />} label="Viewer Suggestions"></FormControlLabel>
                        {/* <FormControlLabel onChange={((e) => handleChange(e, "public"))} control={<Switch defaultChecked />} label="Public"></FormControlLabel> */}
                    </div>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        color="primary"
                    >
                        Start planning
                    </Button>
                    <Snackbar open={open} onClose={((e) => setOpen(false))} autoHideDuration={6000}>
                        <Alert severity="error" sx={{ width: '100%' }}>
                            {snackbar}
                        </Alert>
                    </Snackbar>
                </Box>
            </Box>
        </Container>
    );
}