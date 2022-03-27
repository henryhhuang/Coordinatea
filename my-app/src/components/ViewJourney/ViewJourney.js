import { Mapbox } from '../Mapbox/Mapbox';
import Grid from '@mui/material/Grid';
import './ViewJourney.css';
import React, { useState, useCallback } from 'react';
import { useParams, useLocation } from "react-router-dom";
import { CommentList } from '../Comments/CommentList/CommentList';
import { makeStyles, withStyles } from "@material-ui/core/styles";
import MuiListItemButton from '@mui/material/ListItemButton';
import { MarkerContent } from '../MarkerContent/MarkerContent'
import { useQuery } from '@apollo/client'
import { Journey_Querys } from '../../graphql/queries/journey'
import { Common_Queries } from '../../graphql/queries/common';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Markers } from '../Markers/Markers';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';

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
    const [tabValue, setTabValue] = useState("1");
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
    const { loading: getKeyLoading, error: getKeyError, data: getKeyData } = useQuery(Common_Queries.GET_MAPBOX_KEY)
    const navigate = useNavigate();

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

    //wait to get imageId before opening content panel
    useEffect(() => {
        if (openMarker && imageMarker) {
            setOpen(true);
        }
    }, [imageMarker])

    const handleChange = (event, value) => {
        setCurrentMarker(value);
    };

    const handleTabChange = (event, value) => {
        setTabValue(value);
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
                    <TabPanel value="1" sx={{ maxheight: '85vh', overflow: 'auto' }}>
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
                    <TabPanel value="2" sx={{ height: '85vh' }}>
                        <CommentList parentId={journeyId} />
                    </TabPanel>
                </TabContext>
                {/*open && openMarker != null ? (
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
                        )*/}
            </Grid>
        </Grid>
    </>)
}