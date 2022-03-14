import { Mapbox } from '../Mapbox/Mapbox';

import Grid from '@mui/material/Grid';
import React, { useRef, useState, forwardRef } from 'react';
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
import { Button } from '@mui/material';
const ListItemButton = withStyles({
    root: {
      "&$selected": {
        backgroundColor: '#67B7D1'
      }
    },
    selected: {}
  })(MuiListItemButton);

// todo fix url routing in this component
const url = window.location.href;

export function CreateJourney () {
    let { id, id2 } = useParams();
    const [open, setOpen] = React.useState(0);
    const [currentMarker, setCurrentMarker] = React.useState(0);
    const [openMarker, setOpenMarker] = React.useState(id2 || 0);
    //todo: get journey info from db using id
    const [journey, setJourney] = useState(journeyMock)
    const [markers, setMarkers] = useState(mock);
    //todo: call db to set existing markers for the journey if it exists

    const [newMarker, setNewMarker] = useState();

    const markerPlaceRef = useRef(null);
    const markerDateRef = useRef(null);

    const handleChange = (event, value) => {
        setCurrentMarker(value);
    };
    
    const onSearch = (result) => {
        let marker = {
            bbox: result.bbox,
            center: result.center,
            place: result.place_name
        }
        setNewMarker(marker);
    }

    const handleBack = () => {
        window.history.pushState({}, null, url);
        setOpen(false);
    }

    const handleMarkerSubmit = (e) => {
        e.preventDefault();
    
        //validation here?
        const place = markerPlaceRef.current.value;
        const date = markerDateRef.current.value;
        const newMarker = {
            place,
            date
        }
        setOpen(true);
        setNewMarker(newMarker);
    }

    const handleSubmit = (e, title, description) => {
        console.log(newMarker.place, newMarker.date, title, description);
        setOpen(false);
        setNewMarker();
        //send request to save
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
            <Mapbox onSearch={onSearch} changeCurrentMarker={handleChange} currentMarker={currentMarker} markersParent={markers} markerCreation={true}></Mapbox>
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
                            <TextField
                            required
                            id="outlined-required"
                            label="Required"
                            defaultValue="Date"
                            sx={{width: '80%'}}
                            inputRef={markerDateRef}
                            />   
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
                                            {marker.date}
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