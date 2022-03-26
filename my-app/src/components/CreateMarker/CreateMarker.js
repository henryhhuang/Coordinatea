import { Mapbox } from '../Mapbox/Mapbox';

import Grid from '@mui/material/Grid';
import React, { useRef, useState, useEffect } from 'react';
import mock from '../ViewJourney/mock.json';
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

const ListItemButton = withStyles({
    root: {
      "&$selected": {
        backgroundColor: '#67B7D1'
      }
    },
    selected: {}
  })(MuiListItemButton);

const url = window.location.href;

export function CreateMarker () {
    const { journeyId, id2 } = useParams();
    const [open, setOpen] = React.useState(0);
    const [currentMarker, setCurrentMarker] = React.useState(0);
    const [openMarker, setOpenMarker] = React.useState(id2 || 0);
    // todo let user edit their journey card here
    const [journey, setJourney] = useState(journeyMock)
    const [markers, setMarkers] = useState([]);
    // const [image, setImage] = useState();
    const [uploadedImage, setUploadedImage] = useState();
    const [newMarker, setNewMarker] = useState();
    const [accessToken, setAccessToken] = useState();
    const [date, setDate] = useState();
    const markerPlaceRef = useRef(null);
    const markerDateRef = useRef(null);
    const navigate = useNavigate();

    const [getMarkers, {data, loading, error}] = useLazyQuery(Journey_Querys.GET_MARKERS, {
        variables: { journeyId }
    })
    const {loading: getKeyLoading, error: getKeyError, data: getKeyData} = useQuery(Common_Queries.GET_MAPBOX_KEY)

    //initialize key
    useEffect(() => {
        if (!getKeyLoading && getKeyData) {
            setAccessToken(getKeyData.getMapboxKey);
        }
    }, [getKeyData])

    //refactor to a utils folder
    const uploadImage = (file) => {
        const formData = new FormData();
        formData.append('file', file);

        fetch('http://147.182.149.236:5000/api/image/0/', {
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

    const [createMarker, { data: createData, loading: createLoading, error: createError }] = useMutation(Journey_Mutations.CREATE_MARKER);

    //get markers on render
    useEffect(() => {
        getMarkers();
    }, [])

    //set markers everytime data is changed
    useEffect(() => {
        if (!loading && data) {
            setMarkers(data.getMarkers)
        }
    }, [data])

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
        if (!createLoading && createData) {
            getMarkers();
            // navigate(createData.createMarker.id, { replace: true });
        }
    }, [createData])

    const handleChange = (event, value) => {
        setCurrentMarker(value);
    };

    const handleBack = () => {
        window.history.pushState({}, null, url);
        setOpen(false);
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
    
        //todo: handle validation
        let marker = newMarker;
        marker.date = date;
        setOpen(true);
        setNewMarker(marker);
    }

    const handleSubmit = (e, title, description, image) => {
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
        uploadImage(image);
    }

    const handleContentOpen = () => {
        //todo: check if url ends with /
        // window.history.pushState({}, null, url + "/1");
        setOpenMarker(1);
        setOpen(true);
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
                    accessToken={accessToken}></Mapbox>
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
                <CreateMarkerContent className="marker-content"
                    handleBack={handleBack}
                    handleSubmit={handleSubmit}>
                </CreateMarkerContent>
            ) : (
                <List sx={{ maxHeight: '800px', overflow: 'auto', width: '100%', bgcolor: 'background.paper' }}>
                    {newMarker &&
                        <ListItem sx={{display: 'flex', flexDirection: 'column'}} component="form">
                            <TextField sx={{width: '80%', paddingBottom:'20px'}}
                                required
                                id="outlined-required"
                                label="Required"
                                defaultValue={newMarker.place}
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
                                <Avatar>
                                    <BeachAccessIcon sx={{ color: blue[500] }}/>
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
                                            <IconButton disabled={!(currentMarker == marker.id)} onClick={handleContentOpen}>
                                                <Typography
                                                    sx={{ display: 'inline' }}
                                                    component="span"
                                                    variant="body2"
                                                    color="blue"
                                                    >Read more
                                                </Typography>
                                            </IconButton>
                                            </React.Fragment>
                                        }
                                        />
                            </ListItemButton>
                            <Divider variant="inset" component="li" />
                        </div>
                    ))}
                </List>
            )}
        </Grid>
    </Grid>
    </>)
}