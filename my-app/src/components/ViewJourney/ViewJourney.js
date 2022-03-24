import { Mapbox } from '../Mapbox/Mapbox';
import Grid from '@mui/material/Grid';
import './ViewJourney.css';
import React, { useState, useCallback } from 'react';
import mock from '../ViewJourney/mock.json';
import journeyMock from '../ViewJourney/journey_mock.json'
import { useParams, useLocation } from "react-router-dom";
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import List from '@mui/material/List';
import { CommentList } from '../Comments/CommentList/CommentList';
import { makeStyles, withStyles } from "@material-ui/core/styles";
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import MuiListItemButton from '@mui/material/ListItemButton';
import { blue } from '@mui/material/colors';
import { IconButton } from '@mui/material';
import { MarkerContent } from '../MarkerContent/MarkerContent'
import { CSSTransition } from 'react-transition-group';
import { TransitionGroup } from 'react-transition-group';
import { useQuery } from '@apollo/client'
import { Journey_Querys } from '../../graphql/queries/journey'
import { Common_Queries } from '../../graphql/queries/common';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";


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

export function ViewJourney() {
    const [commentsOpen, setCommentsOpen] = useState(true);
    const [markers, setMarkers] = useState([]);
    const [currentMarker, setCurrentMarker] = useState();
    const [open, setOpen] = useState(false);
    const [openMarker, setOpenMarker] = useState({});
    const { journeyId, markerId } = useParams();
    const [imageMarker, setImageMarker] = useState();
    const [accessToken, setAccessToken] = useState();
    const { loading, error, data } = useQuery(Journey_Querys.GET_MARKERS, {
        variables: { journeyId }
    });
    const {loading: getKeyLoading, error: getKeyError, data: getKeyData} = useQuery(Common_Queries.GET_MAPBOX_KEY)
    const navigate = useNavigate();

    //initialize key
    useEffect(() => {
        if (!getKeyLoading && getKeyData) {
            setAccessToken(getKeyData.getMapboxKey);
        }
    }, [getKeyData])

    // const getMarkerImageIds = useCallback((markerId) => {
    //     fetch('http://localhost:5000/api/imageIds/' + markerId + '/marker', {
    //         method: 'GET',
    //         credentials: 'include',
    //     })
    //     .then((res) => res.json())
    //     .then((result) => {
    //         console.log(result);
    //         setImageMarker(result);
    //     }).catch((error) => {
    //         console.log('error', error);
    //     })
    // });


    useEffect(() => {
        if (!loading) {
            setMarkers(data.getMarkers)
        }
    }, [data])

    //wait to get imageId before opening content panel
    useEffect(() => {
        if (openMarker && imageMarker) {
            setOpen(true);
        }
    }, [imageMarker])

    const handleChange = (event, value) => {
        setCurrentMarker(value);
    };

    //todo: doesn't work when user clicks browser's back button
    const handleBack = () => {
        setOpen(false);
        setOpenMarker({});
        navigate(-1)
    }

    const handleContentOpen = () => {
        //Todos: check if url ends with / and add the / in push if necessary
        //add a check if the url has :journeyId/:markerId, we should show details about the openMarker
        if (!url.includes(markerId)) {
            navigate(currentMarker);
        }
        let openMarker = markers.find((marker => marker.id == currentMarker));
        setOpenMarker(openMarker);
        setImageMarker(openMarker.imageId);
        // getMarkerImageIds(currentMarker);
    }

    return (<>
        <Grid container>
            <Grid className="map-container" item xs={8}>
                {accessToken &&
                <Mapbox 
                    changeCurrentMarker={handleChange} 
                    currentMarker={currentMarker} 
                    markersParent={markers} 
                    markerCreation={false}
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
                {open && openMarker != null ? (
                    <MarkerContent className="marker-content"
                        title={openMarker.title}
                        description={openMarker.description}
                        images={imageMarker}
                        handleBack={handleBack}
                    ></MarkerContent>
                ) : commentsOpen ?
                    (<CommentList parentId={journeyId} />) : (
                        <List sx={{ maxHeight: '800px', overflow: 'auto', width: '100%', bgcolor: 'background.paper' }}>
                            {markers.map((marker) => (
                                <div key={'list-' + marker.id} className="marker-container">
                                    <ListItemButton selected={currentMarker == marker.id} onClick={(e) => handleChange(e, marker.id)} alignItems="flex-start">
                                        <ListItemAvatar>
                                            <Avatar>
                                                <BeachAccessIcon sx={{ color: blue[500] }} />
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