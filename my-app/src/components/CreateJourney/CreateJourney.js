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
import { uploadImage } from '../../util/uploadImage.mjs';
import { Switch } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import "./CreateJourney.css"

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function CreateJourney() {

    const titleRef = useRef(null);
    const descriptionRef = useRef(null);
    const [fromDate, setFromDate] = useState();
    const [toDate, setToDate] = useState();
    const [image, setImage] = useState();
    const [uploadedImage, setUploadedImage] = useState();
    const [isImageUploaded, setIsImageUploaded] = useState(false);
    const [journey, setJourney] = useState();

    const [journeyType, setJourneyType] = useState("PREVIOUS");
    const [suggestionsEnabled, setSuggestionsEnabled] = useState(true);
    const [isPublic, setIsPublic] = useState(true);

    const [open, setOpen] = useState();
    const [snackbar, setSnackbar] = useState();

    const navigate = useNavigate();

    const [createJourney] = useMutation(Journey_Mutations.CREATE_JOURNEY, {
        onCompleted: data => {
            if (data.createJourney.journeyType === "PLAN") {
                navigate("../journey/plan/" + data.createJourney.id, { replace: true })
            } else {
                navigate(data.createJourney.id, { replace: true })
            }
        },
        onError: error => setErrorSnackbar(error.message)
    })

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
                        suggestionsEnabled,
                        isPublic,
                        journeyType
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
                        isPublic,
                        journeyType
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
        switch (value) {
            case 'suggestions':
                setSuggestionsEnabled(event.target.checked);
            case 'public':
                setIsPublic(event.target.checked);
            default:
                setJourneyType(event.target.value);
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!titleRef.current.value || !descriptionRef.current.value) {
            setSnackbar("A title, description, dates and image are required")
            setOpen(true);
            return;
        }

        let newJourney = {
            title: titleRef.current.value,
            description: descriptionRef.current.value,
            imageId: null,
            toDate: toDate,
            fromDate: fromDate
        }
        if (isImageUploaded) {
            uploadImage(image, setUploadedImage, setErrorSnackbar);
        } else {
            newJourney.imageId = ""
        }
        setJourney(newJourney);
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Create a Journey
                </Typography>
                <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
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
                    <FormControl sx={{ marginTop: "20px" }} fullWidth>
                        <InputLabel id="demo-simple-select-label">Journey Type</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={journeyType}
                            label="Journey Type"
                            onChange={((e) => handleChange(e, "type"))}
                        >
                            <MenuItem value={"PREVIOUS"}>Past Journey</MenuItem>
                            <MenuItem value={"PLAN"}>Plan</MenuItem>
                        </Select>
                    </FormControl>
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
                        color="secondary"
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
                        {/* <FormControlLabel onChange={((e) => handleChange(e, "public"))}  control={<Switch defaultChecked />} label="Public"></FormControlLabel> */}
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