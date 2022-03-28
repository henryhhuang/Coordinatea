import { Mapbox } from '../Mapbox/Mapbox';
import Grid from '@mui/material/Grid';
import './ViewJourney.css';
import React, { useState, useCallback } from 'react';
import { useParams, useLocation } from "react-router-dom";
import { CommentList } from '../Comments/CommentList/CommentList';
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { MarkerContent } from '../MarkerContent/MarkerContent'
import { useQuery, useLazyQuery, useMutation } from '@apollo/client'
import { Journey_Querys } from '../../graphql/queries/journey'
import { Common_Queries } from '../../graphql/queries/common';
import { Journey_Mutations } from '../../graphql/mutation/journey';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Markers } from '../Markers/Markers';
import { Button } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { uploadImage } from '../../api.mjs';

import PublicIcon from '@mui/icons-material/Public';
import PlaceIcon from '@mui/icons-material/Place';
import HotelIcon from '@mui/icons-material/Hotel';
import RestaurantIcon from '@mui/icons-material/Restaurant';

const CreateMarkerButton = withStyles({
    root: {
        "&$selected": {
            backgroundColor: "black"
        },
        "&:hover": {
            backgroundColor: "white"
        },
        // color: "black",
        backgroundColor: "white",
        position: "absolute",
        top: "5%",
        right: "0",
        zIndex: "1",
        // textTransform: "none",
        margin: "12px"
    },
    selected: {},
    hover: {}
})(Button)

//cant use this since if someone enters the url state will be empty
// const location = useLocation()
// const { from } = location.state

const url = window.location.href;

export function ViewJourney() {
    const [commentsOpen, setCommentsOpen] = useState(false);
    const [markers, setMarkers] = useState([]);
    const [currentMarker, setCurrentMarker] = useState();
    const [open, setOpen] = useState(false);
    const [openMarker, setOpenMarker] = useState({});
    const { journeyId, markerId } = useParams();
    const [imageMarker, setImageMarker] = useState();
    const [accessToken, setAccessToken] = useState();
    const [commentMarkerCreation, setCommentMarkerCreation] = useState(false);
    const [suggestionImage, setSuggestionImage] = useState();
    const [newSuggestion, setNewSuggestion] = useState();
    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);
    const [suggestions, setSuggestions] = useState([]);
    const { loading, error, data } = useQuery(Journey_Querys.GET_MARKERS, {
        variables: { journeyId }
    });
    const {loading: getKeyLoading, error: getKeyError, data: getKeyData} = useQuery(Common_Queries.GET_MAPBOX_KEY)

    const [getSuggestions, {loading: suggestionLoading, error: suggestionError, data: suggestionData}] = useLazyQuery(Journey_Querys.GET_SUGGESTIONS, {
        variables: { markerId: currentMarker }
    })

    const [createSuggestion, { loading: createLoading, error: createError, data: createData }] = useMutation(Journey_Mutations.CREATE_SUGGESTION)

    const navigate = useNavigate();

    useEffect(() => {
        if (newSuggestion && suggestionImage) {
            createSuggestion({
                variables: {
                    suggestion: {
                        markerId: newSuggestion.markerId,
                        description: newSuggestion.description,
                        imageId: suggestionImage,
                        longitude: newSuggestion.longitude,
                        latitude: newSuggestion.latitude,
                        type: newSuggestion.type
                    }
                }
            })
        }
    }, [suggestionImage]);

    //initialize key
    useEffect(() => {
        if (!getKeyLoading && getKeyData) {
            setAccessToken(getKeyData.getMapboxKey);
        }
    }, [getKeyData]);

    useEffect(() => {
        if (!loading) {
            setMarkers(data.getMarkers)
        }
    }, [data])

    //get suggestions for new marker
    useEffect(() => {
        if (currentMarker) {
            getSuggestions();
        }
    }, [currentMarker])

    //set suggestion data
    useEffect(() => {
        if (!suggestionLoading && suggestionData) {
            setSuggestions(suggestionData.getSuggestions);
        }
    }, [suggestionData])

    //wait to get imageId before opening content panel
    useEffect(() => {
        if (openMarker && imageMarker) {
            setOpen(true);
        }
    }, [imageMarker])

    //resend get request for suggestions after a new suggestion is saved
    useEffect(() => {
        if (!createLoading && createData) {
            getSuggestions();
        }
    }, [createData]);

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

    const onCommentMarkerCreate = (e) => {
        setCommentMarkerCreation(null);
    }

    const onCommentMarkerSubmit = (markerId, description, image, longitude, latitude, type) => {
        uploadImage(image, setSuggestionImage)
        setNewSuggestion({
            markerId,
            description,
            longitude,
            latitude,
            type
        })
    }   

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };

    const handleClose = (type) => {
        setAnchorEl(null);
        if (type != 'close') {
            setCommentMarkerCreation(type);
        }
    };

    return (<>
        <Grid container>
            {accessToken &&
            <Grid className="map-container" item xs={8}>
                {currentMarker &&  (
                    <React.Fragment>
                        <CreateMarkerButton
                            id="basic-button"
                            aria-controls={menuOpen ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={menuOpen ? 'true' : undefined}
                            onClick={handleClick}
                        >
                            Drop a suggestion for this marker
                        </CreateMarkerButton>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={menuOpen}
                            onClose={(() => {handleClose("close")})}
                            MenuListProps={{
                            'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem onClick={(() => {handleClose("general")})}>
                                <PublicIcon sx={{paddingRight: "8px"}}></PublicIcon>
                                General
                            </MenuItem>
                            <MenuItem onClick={(() => {handleClose("hotel")})}><HotelIcon sx={{paddingRight: "8px"}}></HotelIcon>Hotel</MenuItem>
                            <MenuItem onClick={(() => {handleClose("restaurant")})}><RestaurantIcon sx={{paddingRight: "8px"}}></RestaurantIcon>Restaurant</MenuItem>
                            <MenuItem onClick={(() => {handleClose("tourist")})}><PlaceIcon sx={{paddingRight: "8px"}}></PlaceIcon>Tourist Attraction</MenuItem>
                        </Menu>
                    </React.Fragment>
                )}

                <Mapbox 
                    changeCurrentMarker={handleChange} 
                    currentMarker={currentMarker} 
                    markersParent={markers} 
                    markerCreation={false}
                    commentMarkerCreation={commentMarkerCreation}
                    onCommentMarkerCreate={onCommentMarkerCreate}
                    onCommentMarkerSubmit={onCommentMarkerSubmit}
                    suggestions={suggestions}
                    accessToken={accessToken}></Mapbox>
            </Grid>
            }
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
                        markers && (
                        <Markers
                            markers={markers}
                            handleChange={handleChange}
                            handleContentOpen={handleContentOpen}
                            handleBack={handleBack}
                            currentMarker={currentMarker}></Markers>)
                    )}
            </Grid>
        </Grid>
    </>)
}