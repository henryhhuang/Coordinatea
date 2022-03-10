import React, { useRef, useEffect, useState } from 'react';
import Map, {Marker, Popup, useControl} from 'react-map-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import mapboxgl from 'mapbox-gl';
import "./MapboxReact.css"

//todo will need to retrieve the key from backend
let accessToken = 'pk.eyJ1IjoiZGFwcGVycXVva2thIiwiYSI6ImNsMGgzZmdmazA0dm4zaW1qcjNmanhtNHYifQ.ODWLrgo7OhsbqXzGMsz1ug';
//todo id from backend when markers are saved
let id = 1;

export function MapBoxReact(props) {

  const { markerCreation } = props;
  const [markers, setMarkers] = useState([]);
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
      if (location) {
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
    mapRef.current.on('move', () => {
      setLng(mapRef.current.getCenter().lng.toFixed(4));
      setLat(mapRef.current.getCenter().lat.toFixed(4));
      setZoom(mapRef.current.getZoom().toFixed(2));
    });
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
      zoom: 1.19,
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


  const zoomToPopup = React.useCallback((e, id) => {
    //set popup flag to true
    let index;
    setMarkers(() => {
      const newMarkers = [...markers]
      index = newMarkers.findIndex((marker => marker.id == id));
      newMarkers[index].showPopup = true;
      return newMarkers;
    })

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
      <Map
        initialViewState={{
          longitude: 10.9353,
          latitude: 44.8916,
          zoom: 1.19
        }}
        style={{width: 1200, height: 1200}}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        maxZoom={11}
        minZoom={1.23}
        mapboxAccessToken={accessToken}
        ref={mapRef}
        onLoad={onMapLoad}
        onClick={addMarker}>
        <Geocoder accessToken={accessToken} mapboxgl={mapboxgl} position="top-right"></Geocoder>
        {markers.map((marker) => (
          <div key={marker.id}>
            {marker.showPopup && (
            <Popup key={`popup-id-` + marker.id} longitude={marker.longitude} latitude={marker.latitude+0.01}
              anchor="bottom"
              closeOnClick={false}
              onClose={() => setShowPopup(marker.id)}>
              Placeholder text
            </Popup>)}
            <Marker key={`marker-id-lng${marker.longitude + `lat` + marker.latitude}`} className="marker" longitude={marker.longitude} latitude={marker.latitude} onClick={(e) => zoomToPopup(e, marker.id)} anchor="bottom" >
            </Marker>
          </div>
        ))}
      </Map>
    </div>
  );
}


