import { Mapbox } from '../Mapbox/Mapbox';
import Grid from '@mui/material/Grid';
import './ViewJourney.css';
import React, { useRef, useState, forwardRef } from 'react';
import mock from '../ViewJourney/mock.json';
import journeyMock from '../ViewJourney/journey_mock.json'
import { useParams, useLocation } from "react-router-dom";
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import List from '@mui/material/List';
import { makeStyles, withStyles } from "@material-ui/core/styles";
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import MuiListItemButton from '@mui/material/ListItemButton';
import { blue } from '@mui/material/colors';
import { LocationDrawer } from '../LocationDrawer/LocationDrawer';
import { IconButton } from '@mui/material';
import { MarkerContent } from '../MarkerContent/MarkerContent'
import { CSSTransition } from 'react-transition-group';
import { TransitionGroup } from 'react-transition-group';


const ListItemButton = withStyles({
    root: {
      "&$selected": {
        backgroundColor: '#67B7D1'
      }
    },
    selected: {}
  })(MuiListItemButton);

      //cant use this since if someone enters the url state will be empty
    // const location = useLocation()
    // const { from } = location.state

const url = window.location.href;

export function ViewJourney () {
    let { id, id2 } = useParams();
    const [open, setOpen] = React.useState(0);
    const [currentMarker, setCurrentMarker] = React.useState(0);
    const [openMarker, setOpenMarker] = React.useState(id2 || 0);
    //get from db using id
    const [journey, setJourney] = useState(journeyMock)
    const [markers, setMarkers] = useState(mock)
    
    const handleChange = (event, value) => {
        setCurrentMarker(value);
    };
    
    const handleBack = () => {
        window.history.pushState({}, null, url);
        setOpen(false);

    }
    const handleContentOpen = () => {
        //todo: check if url ends with /
        window.history.pushState({}, null, url + "/1");
        setOpenMarker(1);
        setOpen(true);
    }

    return (<>
    <Grid container>
        <Grid className="map-container" item xs={8}>
            <Mapbox changeCurrentMarker={handleChange} currentMarker={currentMarker} markersParent={markers} markerCreation={false}></Mapbox>
        </Grid>
        <Grid
        item
        container
        direction="row"
        justify="center"
        alignItems="center"
        xs={4}>
            {open ? (
                <MarkerContent className="marker-content"
                    title={markers[currentMarker-1].title} 
                    description={markers[currentMarker-1].description}
                    images={markers[currentMarker-1].images}
                    handleBack={handleBack}
                    ></MarkerContent>
            ) : (
                <List sx={{ maxHeight: '800px', overflow: 'auto', width: '100%', bgcolor: 'background.paper' }}>
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
                                            {/* <LocationModal openText={"Read more"} title={marker.title} description={marker.description}>Hi</LocationModal> */}
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