import { MapBoxReact } from '../MapboxReact/MapboxReact';
import Grid from '@mui/material/Grid';
import './ViewJourney.css';
import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Image from 'material-ui-image'
import Stack from '@mui/material/Stack'
import mock from './mock.json';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

export function ViewJourney () {
    const [currentMarker, setCurrentMarker] = React.useState(0);
    //get from db
    const [markers, setMarkers] = useState(mock)
    
    const handleChange = (event, value) => {
        setCurrentMarker(value);
    };
    
    return (<>
    <Grid container spacing={2}>
        <Grid item xs={7}>
            <Item className='map-item'>
                <MapBoxReact changeCurrentMarker={handleChange} markersParent={markers} markerCreation={false}></MapBoxReact>
            </Item>
        </Grid>
        <Grid item xs={5}>
            <Item>
                {currentMarker == 0 ? (
                    <p>Select a marker to see more</p>
                ) : (
                    <Stack className="panel" overflow="auto" spacing={2}>
                    <Item>
                        <p>{markers[currentMarker-1].title}</p>
                    </Item>
                    <Item>
                        <Image src={markers[currentMarker-1].images[0].url}></Image>
                    </Item>
                    <Item>
                        <div className="content">
                            {markers[currentMarker-1].description == "" ? (
                                <p>No description</p>
                            ) : (
                                <p>{markers[currentMarker-1].description}</p>
                            )}
                        </div>
                        <Item>
                    </Item>
                    </Item>
                </Stack>
                )}
            </Item>
        </Grid>
    </Grid>
    </>)
}