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
import { Suggestion_Queries } from '../../graphql/queries/suggestions';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { uploadImage } from '../../util/uploadImage.mjs';
import { MarkerContent } from '../MarkerContent/MarkerContent';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Markers } from '../Markers/Markers';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import { PlaceSuggestions } from '../PlaceSuggestions/PlaceSuggestion';
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

export function PlanMarker (props) {
    const { username } = props;
    const [tabValue, setTabValue] = useState("1");
    const { journeyId, id2 } = useParams();
    const [open, setOpen] = useState(0);
    const [currentMarker, setCurrentMarker] = useState(0);
    const [openMarker, setOpenMarker] = useState(null);
    const [placeSuggestions, setPlaceSuggestions] = useState([]);
    const [journey, setJourney] = useState()
    const [markers, setMarkers] = useState([]);
    const [uploadedImage, setUploadedImage] = useState();
    const [newMarker, setNewMarker] = useState(null);
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

    const [getSuggestions] = useLazyQuery(Suggestion_Queries.GET_PLACE_SUGGESTIONS, {
        onCompleted: data => {
            console.log('data', data);
            setPlaceSuggestions(data.getPlaceSuggestions)}
            ,
        onError: error => setErrorSnackbar(error.message)
    })

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

    const handleChange = (marker, value) => {
        if (value) {
            console.log(value);
            setTabValue(value)
        }
        setCurrentMarker(marker);
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
            longitude: result.center[0],
            latitude: result.center[1]
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
        let marker = {
            journeyId: journeyId,
            title: title,
            description: description,
            place: newMarker.place,
            date: newMarker.date,
            longitude: newMarker.longitude,
            latitude: newMarker.latitude,
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

    const handleTabChange = (event, value) => {
        setTabValue(value);
        if (value === "2") {
            getSuggestions({
                variables: {
                    place: {
                        longitude: newMarker.center[0],
                        latitude: newMarker.center[1],
                        radius: 10000
                    }
                }
            })
        }
    }

    const addMarker = (name, longitude, latitude) => {
        setTabValue("1");
        let marker = {
            place: name,
            longitude: longitude,
            latitude: latitude
        }
        setNewMarker(marker);
    }

    const onPlaceClick = (xid, longitude, latitude) => {
        setCurrentMarker(xid);
        setTabValue("2");
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
                    onPlaceClick={onPlaceClick}
                    placeSuggestions={placeSuggestions}
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
            <TabContext value={tabValue}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleTabChange}>
                        <Tab label="JOURNEY" value="1" />
                        <Tab disabled={newMarker == null || !newMarker.center} label="SUGGESTIONS" value="2" />
                    </TabList>
                </Box>
                {/* todo: to center the markers/comments in tabpanel horizontally. display: "flex", alignItems: "center", this works for markers but breaks comments*/}
                <TabPanel value="1" sx={{width: '100%', height: '95vh', overflow: 'auto', padding:"0px"}}>
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
                    <List sx={{maxHeight: '100vh', overflow: 'auto'}}>
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
                </TabPanel>
                <TabPanel value="2" sx={{ width: '100%', padding: "0px", height: '95vh', padding:"0px"}}>
                        <PlaceSuggestions
                            placeSuggestions={placeSuggestions}
                            currentMarker={currentMarker}
                            handleChange={handleChange}
                            addMarker={addMarker}
                            >
                        </PlaceSuggestions>
                </TabPanel>
            </TabContext>
            <Snackbar open={openSnackbar} onClose={((e) => setOpenSnackbar(false))} autoHideDuration={6000}>
                <Alert severity={snackbar.serverity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Grid>
    </Grid>
    </>)
}