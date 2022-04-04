import { Mapbox } from '../Mapbox/Mapbox';
import Grid from '@mui/material/Grid';
import React, { useRef, useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import List from '@mui/material/List';
import { withStyles } from "@material-ui/core/styles";
import { ListItem } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import MuiListItemButton from '@mui/material/ListItemButton';
import { CreateMarkerContent } from '../CreateMarkerContent/CreateMarkerContent'
import TextField from '@mui/material/TextField';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import { Journey_Mutations } from '../../graphql/mutation/journey'
import { Journey_Querys } from '../../graphql/queries/journey'
import { Common_Queries } from '../../graphql/queries/common';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { uploadImage } from '../../util/uploadImage.mjs';
import { MarkerContent } from '../MarkerContent/MarkerContent';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Markers } from '../Markers/Markers';
import "./CreateMarker.css";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const ListItemButton = withStyles({
    root: {
      "&$selected": {
        backgroundColor: '#8c9cd8'
      }
    },
    selected: {}
  })(MuiListItemButton);

const url = window.location.href;

export function CreateMarker (props) {
    const { username } = props;

    const { journeyId, id2 } = useParams();
    const [open, setOpen] = React.useState(0);
    const [currentMarker, setCurrentMarker] = React.useState(0);
    const [openMarker, setOpenMarker] = React.useState(null);
    const [journey, setJourney] = useState()
    const [markers, setMarkers] = useState([]);
    const [uploadedImage, setUploadedImage] = useState();
    const [newMarker, setNewMarker] = useState();
    const [accessToken, setAccessToken] = useState();
    const [date, setDate] = useState();
    const markerPlaceRef = useRef(null);

    const [openSnackbar, setOpenSnackbar] = useState(true);
    const [snackbar, setSnackbar] = useState({
        serverity: "success",
        message: "Journey successfully created, search a place to add a marker"
    });

    useQuery(Common_Queries.GET_MAPBOX_KEY, {
        onCompleted: data => setAccessToken(data.getMapboxKey)
    })

    const [getMarkers] = useLazyQuery(Journey_Querys.GET_MARKERS, {
        variables: { journeyId },
        onCompleted: data => setMarkers(data.getMarkers),
        onError: error => setErrorSnackbar(error.message)
    })

    const [getJourney] = useLazyQuery(Journey_Querys.GET_JOURNEY, {
        variables: { journeyId },
        onCompleted: journeyData => setJourney(journeyData.getJourney),
        onError: error => setErrorSnackbar(error.message)
    });
      

    const [createMarker] = useMutation(Journey_Mutations.CREATE_MARKER, {
        onCompleted: data => getMarkers(),
        onError: error => setErrorSnackbar(error.message)
    });

    const [deleteMarker] = useMutation(Journey_Mutations.DELETE_MARKER, {
        onCompleted: data => getMarkers(),
        onError: error => setErrorSnackbar(error.message)
    });

    //get markers on render
    useEffect(() => {
        getMarkers();
        getJourney();
    }, [])

    useEffect(() => {
        if (newMarker && uploadedImage) {
            createMarker({
                variables: {
                    marker: {
                        journeyId: journeyId,
                        title: newMarker.title,
                        description: newMarker.description,
                        place: newMarker.place,
                        date: newMarker.date,
                        longitude: newMarker.longitude,
                        latitude: newMarker.latitude,
                        imageId: uploadedImage
                    }
                }
            });
        }
    }, [uploadedImage])

    const handleChange = (value) => {
        setCurrentMarker(value);
    };

    const handleBack = () => {
        setOpen(false);
        setOpenMarker({});
    }

    const onSearch = (result) => {
        let marker = {
            bbox: result.bbox,
            center: result.center,
            place: result.place_name,
            longitude: result.longitude,
            latitude: result.latitude
        }
        setNewMarker(marker);
    }

    const handleMarkerSubmit = (e) => {
        e.preventDefault();
        if (!(date && markerPlaceRef.current.value)) {
            setSnackbar({
                serverity: "error",
                message: "A place and date are required."
            })
            setOpenSnackbar(true);
            return;
        }
        let marker = newMarker;
        marker.date = date;
        marker.place = markerPlaceRef.current.value;
        setOpen(true);
        setNewMarker(marker);
    }

    const handleSubmit = (e, title, description, image) => {
        if (!(image && title && description)) {
            return;
        }
        setOpen(false);
        setNewMarker();
        let marker = {
            journeyId: journeyId,
            title: title,
            description: description,
            place: newMarker.place,
            date: newMarker.date,
            longitude: newMarker.center[0],
            latitude: newMarker.center[1],
        }
        setNewMarker(marker)
        uploadImage(image, setUploadedImage, setErrorSnackbar);
    }

    const handleContentOpen = (e, marker) => {
        setOpenMarker(marker);
        setOpen(true);
    }

    const setErrorSnackbar = (message) => {
        setSnackbar({
            serverity: "error",
            message: message
        });
        setOpenSnackbar(true);
    }

    const removeMarker = (event, markerId) => {
        deleteMarker({
            variables: {
                markerId
            }
        })
    }

    return (<>
    <Grid container>
        <Grid className="map-container" item xs={8}>
            {accessToken &&
                <Mapbox 
                    onSearch={onSearch} 
                    changeCurrentMarker={handleChange} 
                    currentMarker={currentMarker} 
                    markersParent={markers} 
                    markerCreation={true} 
                    accessToken={accessToken}
                    commentMarkerCreation={null}
                    onCommentMarkerCreate={null}
                    onCommentMarkerSubmit={null}
                    suggestions={[]}
                    ></Mapbox>
            }
        </Grid>
        <Grid
        item
        container
        direction="row"
        justify="center"
        alignItems="center"
        xs={4}>
            {open ? (
                <div>
                {openMarker != null ? (
                    <MarkerContent className="marker-content"
                        title={openMarker.title}
                        description={openMarker.description}
                        images={openMarker.imageId}
                        handleBack={handleBack}
                        />     
                ) : (
                    <CreateMarkerContent
                        setErrorSnackbar={setErrorSnackbar}
                        handleBack={handleBack}
                        handleSubmit={handleSubmit}>
                    </CreateMarkerContent> 
                )}
                </div>
            ) : (
                <List sx={{maxHeight: '100vh', overflow: 'auto', width: '100%' }}>
                    {newMarker &&
                        <ListItem sx={{paddingTop: "40px", display: 'flex', flexDirection: 'column'}} component="form">
                            <TextField sx={{width: '80%', paddingBottom:'20px'}}
                                required
                                id="outlined-required"
                                label="Required"
                                value={newMarker.place}
                                inputRef={markerPlaceRef}
                                />
                            <LocalizationProvider className="fromDate" dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Pick a date"
                                    value={date}
                                    onChange={(newValue) => {
                                        setDate(newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                            <ListItemButton onClick={handleMarkerSubmit}>
                                <Avatar sx={{ backgroundColor: "#1b264f" }}>
                                    <AddCircleOutline/>
                                </Avatar>
                            </ListItemButton> 
                        </ListItem>
                    }
                    {markers && journey && (
                        <Markers
                        markers={markers}
                            handleChange={handleChange}
                            handleContentOpen={handleContentOpen}
                            handleBack={handleBack}
                            currentMarker={currentMarker}
                            username={username}
                            journeyOwner={journey.username}
                            removeMarker={removeMarker}/>
                        )
                    }
                </List>
            )}
            <Snackbar open={openSnackbar} onClose={((e) => setOpenSnackbar(false))} autoHideDuration={6000}>
                <Alert severity={snackbar.serverity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Grid>
    </Grid>
    </>)
}