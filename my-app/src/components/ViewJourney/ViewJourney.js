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
import { useQuery } from '@apollo/client'
import { Journey_Querys } from '../../graphql/queries/journey'
import { useEffect } from 'react';
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
    let { journeyId, markerId } = useParams();
    const {loading, error, data} = useQuery(Journey_Querys.GET_MARKERS, {
        variables: { journeyId }
    })
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        if (!loading) {
            setMarkers(data.getMarkers)
        }
    }, [data])

    const [currentMarker, setCurrentMarker] = useState(0);
    const [open, setOpen] = useState(0);
    const [openMarker, setOpenMarker] = useState({});
    
    const handleChange = (event, value) => {
        setCurrentMarker(value);
    };
    
    const handleBack = () => {
        window.history.pushState({}, null, url);
        setOpen(false);

    }
    const handleContentOpen = () => {
        //Todos: check if url ends with / and add the / in push if necessary
        //add a check if the url has :journeyId/:markerId, we should show details about the openMarker
        window.history.pushState({}, null, url + "/" + currentMarker);
        let openMarker = markers.find((marker => marker.id == currentMarker));
        setOpenMarker(openMarker);
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
                    title={openMarker.title} 
                    description={openMarker.description}
                    images={openMarker.images}
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