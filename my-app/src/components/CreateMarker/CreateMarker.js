import { Mapbox } from '../Mapbox/Mapbox';

import Grid from '@mui/material/Grid';
import React, { useRef, useState, useEffect } from 'react';
import journeyMock from '../ViewJourney/journey_mock.json'
import { useParams, useLocation } from "react-router-dom";
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import { withStyles } from "@material-ui/core/styles";
import { ListItem } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import MuiListItemButton from '@mui/material/ListItemButton';
import { blue } from '@mui/material/colors';
import { IconButton } from '@mui/material';
import { CreateMarkerContent } from '../CreateMarkerContent/CreateMarkerContent'
import TextField from '@mui/material/TextField';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import { Journey_Mutations } from '../../graphql/mutation/journey'
import { Journey_Querys } from '../../graphql/queries/journey'
import { Common_Queries } from '../../graphql/queries/common';
import { useNavigate } from "react-router-dom";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { format } from 'date-fns' 
import { uploadImage } from '../../api.mjs';
import { MarkerContent } from '../MarkerContent/MarkerContent';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import DeleteIcon from '@mui/icons-material/Delete';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const ListItemButton = withStyles({
    root: {
      "&$selected": {
        backgroundColor: '#67B7D1'
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

    // const [openMarker, setOpenMarker] = React.useState(id2 || 0);
    // todo let user edit their journey card here
    const [journey, setJourney] = useState()
    const [markers, setMarkers] = useState([]);
    // const [image, setImage] = useState();
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

    const navigate = useNavigate();


    const [getMarkers, {data, loading, error}] = useLazyQuery(Journey_Querys.GET_MARKERS, {
        variables: { journeyId }
    })

    const [getJourney, {loading: journeyLoading, error: journeyError, data: journeyData}] = useLazyQuery(Journey_Querys.GET_JOURNEY, {
        variables: { journeyId }
    });

    const {loading: getKeyLoading, error: getKeyError, data: getKeyData} = useQuery(Common_Queries.GET_MAPBOX_KEY)

    //initialize key
    useEffect(() => {
        if (!getKeyLoading && getKeyData) {
            setAccessToken(getKeyData.getMapboxKey);
        }
    }, [getKeyData])

    const [createMarker, { data: createData, loading: createLoading, error: createError }] = useMutation(Journey_Mutations.CREATE_MARKER);
    const [deleteMarker, { data: deleteData, loading: deleteLoading, error: deleteError }] = useMutation(Journey_Mutations.DELETE_MARKER);

    //get markers on render
    useEffect(() => {
        getMarkers();
        getJourney();
    }, [])

    //set markers once data is retrieved
    useEffect(() => {
        if (!loading && data) {
            setMarkers(data.getMarkers)
        }
    }, [data])

    useEffect(() => {
        if (!journeyLoading && journeyData) {
            setJourney(journeyData.getJourney);
        }
    }, [journeyData])

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

    useEffect(() => {
        if ((!createLoading && createData) || (!deleteLoading && deleteData)) {
            getMarkers();
            // navigate(createData.createMarker.id, { replace: true });
        }
    }, [createData, deleteData])

    useEffect(() => {
        if (!createLoading && createError) {
            setErrorSnackbar(createError.message);
        } else if (!deleteLoading && deleteError) {
            setErrorSnackbar(deleteError.message);
        }
    }, [createError, deleteError])

    const handleChange = (event, value) => {
        setCurrentMarker(value);
    };

    const handleBack = () => {
        window.history.pushState({}, null, url);
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
        // setImage(image);
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
        //todo: check if url ends with /
        // window.history.pushState({}, null, url + "/1");
        // setOpenMarker(1);
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
                    <CreateMarkerContent className="marker-content"
                        setErrorSnackbar={setErrorSnackbar}
                        handleBack={handleBack}
                        handleSubmit={handleSubmit}>
                    </CreateMarkerContent> 
                )}
                </div>
            ) : (
                <List sx={{ maxHeight: '800px', overflow: 'auto', width: '100%', bgcolor: 'background.paper' }}>
                    {newMarker &&
                        <ListItem sx={{display: 'flex', flexDirection: 'column'}} component="form">
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
                                <Avatar>
                                    <AddCircleOutline sx={{ color: blue[500] }}/>
                                </Avatar>
                            </ListItemButton> 
                        </ListItem>
                    }
                    {/* <Divider variant="inset" component="li" /> */}
                    {markers.map((marker) => (
                        <div className="marker-container">
                            <ListItemButton selected={currentMarker == marker.id} onClick={(e) => handleChange(e, marker.id)} alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar sx={{ backgroundColor: blue[500] }}>
                                        <BeachAccessIcon/>
                                    </Avatar>
                                </ListItemAvatar>
                                        <ListItemText
                                        primary={marker.place}
                                        secondary={
                                            <React.Fragment>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                            {format(new Date(marker.date * 1), 'yyyy-MM-dd')}
                                            </Typography>
                                            <IconButton disabled={!(currentMarker == marker.id)} onClick={((e) => handleContentOpen(e, marker))}>
                                                <Typography
                                                    sx={{ display: 'inline' }}
                                                    component="span"
                                                    variant="body2"
                                                    color="blue"
                                                    >Read more
                                                </Typography>
                                            </IconButton>
                                            {journey && journey.username === username &&
                                                <IconButton onClick={((e) => removeMarker(e, marker.id))}>
                                                    <DeleteIcon></DeleteIcon>
                                                </IconButton>
                                            }
                                            </React.Fragment>
                                        }
                                        />
                            </ListItemButton>
                            <Divider variant="inset" component="li" />
                        </div>
                    ))}
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