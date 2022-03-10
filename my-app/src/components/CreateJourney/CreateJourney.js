import { MapBoxReact } from '../MapboxReact/MapboxReact';
import './CreateJourney.css';
import React, { useState } from 'react';

export function CreateJourney () {
    let [markerCreation, setMarker] = useState(true);

    
    const toggleMarkerCreation = () => {
        setMarker(() => {
            return !markerCreation
        })
    }

    return (<>
        <div className='journey-container'>
            <MapBoxReact markerCreation={markerCreation}></MapBoxReact>
            <div className='journey-creation-container'>
             <button className='button' onClick={toggleMarkerCreation}>Toggle Marker Creation</button>          
            </div>
        </div>
    </>)
}