import React, { useRef, useEffect, useState } from 'react';
import Map, {Marker, Popup, useControl} from 'react-map-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import mapboxgl from 'mapbox-gl';
import "./MapboxReact.css"
import { Pagination } from '@mui/material';

//todo will need to retrieve the key from backend
let accessToken = 'pk.eyJ1IjoiZGFwcGVycXVva2thIiwiYSI6ImNsMGgzZmdmazA0dm4zaW1qcjNmanhtNHYifQ.ODWLrgo7OhsbqXzGMsz1ug';
//todo id from backend when markers are saved
let id = 1;

export function MapBoxReact(props) {
  const { changeCurrentMarker, markersParent, markerCreation } = props;
  const [markers, setMarkers] = useState(markersParent);
  const [marker, setMarker] = useState(1);

  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 13.8161,
    zoom: 0.64
  });

  const mapRef = useRef(null);

  //can refactor to its own component too
  //parts taken from https://codesandbox.io/s/l7p179qr6m?file=/src/index.js
  const Geocoder = (props) => {
    const ctrl = useControl(() => new MapboxGeocoder(props), {
      position: props.position
    })
    ctrl.on('result', evt => {
      const {result} = evt;
      const location = result && (result.center || (result.geometry?.type === 'Point' && result.geometry.coordinates));
      if (markerCreation && location) {
        //todo save marker info to database, and store id from backend here
        //we should also check that no duplicate markers are made (same long,latitude)
        const newMarker = {
          id: id,
          longitude: location[0],
          latitude: location[1],
          showPopup: false
        }
        id++;
        setMarkers(() => [...markers, newMarker])
        }
    });
    return null;
  }

  //todo remove probably
  const [lng, setLng] = useState(10.9353);
  const [lat, setLat] = useState(44.8916);
  const [zoom, setZoom] = useState(1.19);

  const onMapLoad = React.useCallback(() => {
    mapRef.current.on('load', function () {
      mapRef.current.resize();
    });
    //For testing
    // mapRef.current.on('move', () => {
    //   setLng(mapRef.current.getCenter().lng.toFixed(4));
    //   setLat(mapRef.current.getCenter().lat.toFixed(4));
    //   setZoom(mapRef.current.getZoom().toFixed(2));
    // });
  });

  //set popup flag to false
  //todo probably a better way to do this
  const setShowPopup = (id) => {
    setMarkers(() => {
      const newMarkers = [...markers]
      let index = newMarkers.findIndex((marker => marker.id == id));
      newMarkers[index].showPopup = false;
      return newMarkers
    })
  }

  const addMarker = (e) => {
    //todo decide whether we allow mouse click creation of markers (easier if we don't)
    if (false && markerCreation) {
      const newMarker = [e.lngLat.lng, e.lngLat.lat]
      setMarkers(() => [...markers, newMarker])
    }
  };

  const zoomToOriginal = () => {
      mapRef.current.flyTo({
      center: [10.9353, 44.8916],
      zoom: 1.20,
      bearing: 0,
      speed: 2, // make the flying slow
      curve: 2, // change the speed at which it zooms out
      // This can be any easing function: it takes a number between
      // 0 and 1 and returns another number between 0 and 1.
      easing: (t) => t,
      // this animation is considered essential with respect to prefers-reduced-motion
      essential: true
      });
  }

  const paginationChange = (e, id) => {
    if (!mapRef.current) {
      return;
    }
    setMarker(id)
    changeCurrentMarker(e, id);
    zoomToPopup(null, id);
  }

  const zoomToPopup = React.useCallback((e, id) => {
    changeCurrentMarker(null, id);
    setMarker(id)
    let index = markers.findIndex((marker => marker.id == id));
    //set popup flag to true
    // setMarkers(() => {
    //   const newMarkers = [...markers]
    //   index = newMarkers.findIndex((marker => marker.id == id));
    //   newMarkers[index].showPopup = true;
    //   return newMarkers;
    // })

    mapRef.current.flyTo({
      center: [markers[index].longitude, markers[index].latitude],
      zoom: 13,
      bearing: 0,
      speed: 2, // make the flying slow
      curve: 2, // change the speed at which it zooms out
      // This can be any easing function: it takes a number between
      // 0 and 1 and returns another number between 0 and 1.
      easing: (t) => t,
      // this animation is considered essential with respect to prefers-reduced-motion
      essential: true
      });
  });

  return (
    <div className='MapboxReact'>
      <div className="sidebar">
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
          <div>
            <button onClick={zoomToOriginal}>Zoom out</button>
          </div>
      </div>
      <div className="map-container">
      <Pagination count={markers.length} page={marker} onChange={paginationChange} color="secondary" />
      <Map
        className="map"
        initialViewState={viewport}
        // mapStyle="mapbox://styles/mapbox/streets-v11"
        mapStyle="mapbox://styles/mapbox/light-v10"
        maxZoom={11}
        // minZoom={1}
        mapboxAccessToken={accessToken}
        ref={mapRef}
        onLoad={onMapLoad}
        onClick={addMarker}>
        <Geocoder 
          accessToken={accessToken} 
          mapboxgl={mapboxgl} position="top-right"
          // flyTo={false}
          >
          </Geocoder>
        {markers.map((marker) => (
          <div key={marker.id}>
            {console.log(marker)}
            {/* {marker.showPopup && (
            <Popup key={`popup-id-` + marker.id} longitude={marker.longitude} latitude={marker.latitude+0.01}
              anchor="bottom"
              closeOnClick={false}
              onClose={() => setShowPopup(marker.id)}>
              Placeholder text
            </Popup>)} */}
            <Marker key={`marker-id-lng${marker.longitude + `lat` + marker.latitude}`} className="marker" longitude={marker.longitude} latitude={marker.latitude} onClick={(e) => zoomToPopup(e, marker.id)} anchor="bottom" >
            </Marker>
          </div>
        ))}
      </Map>
      </div>
    </div>
  );
}


