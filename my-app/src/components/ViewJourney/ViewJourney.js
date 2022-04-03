import { Mapbox } from '../Mapbox/Mapbox';
import Grid from '@mui/material/Grid';
import './ViewJourney.css';
import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import { CommentList } from '../Comments/CommentList/CommentList';
import { withStyles } from "@material-ui/core/styles";
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
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import PublicIcon from '@mui/icons-material/Public';
import PlaceIcon from '@mui/icons-material/Place';
import HotelIcon from '@mui/icons-material/Hotel';
import RestaurantIcon from '@mui/icons-material/Restaurant';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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

export function ViewJourney(props) {
    const { username } = props;

    const [tabValue, setTabValue] = useState("1");
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
    const [journey, setJourney] = useState();
    const [journeyOwner, setJourneyOwner] = useState();

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbar, setSnackbar] = useState();

    useQuery(Common_Queries.GET_MAPBOX_KEY, {
        onCompleted: data => setAccessToken(data.getMapboxKey)
    })

    useQuery(Journey_Querys.GET_JOURNEY, {
        variables: { journeyId },
        onCompleted: data => {
            setJourney(data.getJourney);
            setJourneyOwner(data.getJourney.username);
        }
    });

    useQuery(Journey_Querys.GET_MARKERS, {
        variables: { journeyId },
        onCompleted: data => setMarkers(data.getMarkers)
    });

    const [getSuggestions] = useLazyQuery(Journey_Querys.GET_SUGGESTIONS, {
        variables: { markerId: currentMarker },
        onCompleted: data => setSuggestions(data.getSuggestions)
    })

    const [createSuggestion] = useMutation(Journey_Mutations.CREATE_SUGGESTION, {
        onCompleted: data => getSuggestions(),
        onError: error => setErrorSnackbar(error.message)
    })

    const [deleteSuggestion] = useMutation(Journey_Mutations.DELETE_SUGGESTION, {
        onCompleted: data => getSuggestions()
    });

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

    useEffect(() => {
        if (newSuggestion) {
            createSuggestion({
                variables: {
                    suggestion: {
                        markerId: newSuggestion.markerId,
                        description: newSuggestion.description,
                        imageId: "",
                        longitude: newSuggestion.longitude,
                        latitude: newSuggestion.latitude,
                        type: newSuggestion.type
                    }
                }
            })
        }
    }, [newSuggestion])

    //get suggestions for new marker
    useEffect(() => {
        if (currentMarker) {
            getSuggestions();
        }
    }, [currentMarker])

    //wait to get imageId before opening content panel
    useEffect(() => {
        if (openMarker && imageMarker) {
            setOpen(true);
        }
    }, [imageMarker])

    const handleChange = (value) => {
        setCurrentMarker(value);
    };

    const handleTabChange = (event, value) => {
        setTabValue(value);
    }

    const removeSuggestion = (event, suggestionId) => {
        deleteSuggestion({
            variables: {
                suggestionId
            }
        })
    }

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
        if (image) {
            uploadImage(image, setSuggestionImage, setErrorSnackbar)
        }
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

    const setErrorSnackbar = (message) => {
        setSnackbar(message);
        setOpenSnackbar(true);
    }

    return (<>
        <Grid container >
            {accessToken &&
                <Grid className="map-container" item xs={8}>
                    {currentMarker && journey && journey.suggestionsEnabled && (
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
                                onClose={(() => { handleClose("close") })}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem onClick={(() => { handleClose("general") })}>
                                    <PublicIcon sx={{ paddingRight: "8px" }}></PublicIcon>
                                    General
                                </MenuItem>
                                <MenuItem onClick={(() => { handleClose("hotel") })}><HotelIcon sx={{ paddingRight: "8px" }}></HotelIcon>Hotel</MenuItem>
                                <MenuItem onClick={(() => { handleClose("restaurant") })}><RestaurantIcon sx={{ paddingRight: "8px" }}></RestaurantIcon>Restaurant</MenuItem>
                                <MenuItem onClick={(() => { handleClose("tourist") })}><PlaceIcon sx={{ paddingRight: "8px" }}></PlaceIcon>Tourist Attraction</MenuItem>
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
                        journeyOwner={journeyOwner}
                        username={username}
                        removeSuggestion={removeSuggestion}
                        setErrorSnackbar={setErrorSnackbar}
                        accessToken={accessToken}></Mapbox>
                </Grid>
            }
            <Grid
                item
                container
                direction="column"
                xs={4}
            >
                <TabContext value={tabValue}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleTabChange}>
                            <Tab label="JOURNEY" value="1" />
                            <Tab label="COMMENTS" value="2" />
                        </TabList>
                    </Box>
                    {/* todo: to center the markers/comments in tabpanel horizontally. display: "flex", alignItems: "center", this works for markers but breaks*/}
                    <TabPanel value="1" sx={{ height: '95vh', overflow: 'auto', padding:"0px"}}>
                        {open && openMarker != null ? (
                            <MarkerContent className="marker-content"
                                title={openMarker.title}
                                description={openMarker.description}
                                images={imageMarker}
                                handleBack={handleBack}
                            ></MarkerContent>
                        ) : (
                            markers && (
                                <Markers
                                    markers={markers}
                                    handleChange={handleChange}
                                    handleContentOpen={handleContentOpen}
                                    handleBack={handleBack}
                                    currentMarker={currentMarker}></Markers>)
                        )}
                    </TabPanel>
                    <TabPanel value="2" sx={{ padding: "0px" }}>
                        <CommentList parentId={journeyId} />
                    </TabPanel>
                </TabContext>
                <Snackbar open={openSnackbar} onClose={((e) => setOpenSnackbar(false))} autoHideDuration={6000}>
                    <Alert severity="error" sx={{ width: '100%' }}>
                        {snackbar}
                    </Alert>
                </Snackbar>
            </Grid>
        </Grid>
    </>)
}