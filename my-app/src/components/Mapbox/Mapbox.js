import { useRef, useEffect, useState, useCallback} from 'react';
import ReactMapGL, {Marker, useControl} from 'react-map-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import mapboxgl from 'mapbox-gl';
import { Suggestion } from '../Suggestion/Suggestion';
import { CreateSuggestion } from '../CreateSuggestion/CreateSuggestion';
import "./Mapbox.css"

//https://stackoverflow.com/questions/65434964/mapbox-blank-map-react-map-gl-reactjs
//to transiple mapbox web worker seperately
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
mapboxgl.workerClass = MapboxWorker;

//used to store markers on the client
let id = 1;

export function Mapbox(props) {
  let { onSearch, 
    changeCurrentMarker, 
    currentMarker, 
    markerCreation, 
    accessToken, 
    commentMarkerCreation,
    onCommentMarkerCreate,
    onCommentMarkerSubmit,
    removeSuggestion,
    username,
    journeyOwner,
    setErrorSnackbar,
    placeSuggestions} = props;

  const [markers, setMarkers] = useState([]);
  const [commentMarkers, setCommentMarkers] = useState([]);
  const [newSuggestion, setNewSuggestion] = useState();
  const [createSuggestion, setCreateSuggestion] = useState();

  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 13.8161,
    zoom: 0.64
  });

  const mapRef = useRef(null);

  useEffect(() => {
    if (props.markersParent) {
      setMarkers(props.markersParent)
    }
  }, [props.markersParent])

  useEffect(() => {
    setCommentMarkers(props.suggestions);
  }, [props.suggestions])

  useEffect(() => {
    if (mapRef && mapRef.current) {
        currentMarker = props.currentMarker
        zoomToMarker(null, currentMarker);
    }
  }, [props.currentMarker])

  //parts taken from https://codesandbox.io/s/l7p179qr6m?file=/src/index.js
  const Geocoder = (props) => {
    const ctrl = useControl(() => new MapboxGeocoder(props), {
      position: props.position
    })
    ctrl.on('result', evt => {
      const {result} = evt;
      const location = result && (result.center || (result.geometry?.type === 'Point' && result.geometry.coordinates));
      if (markerCreation && location) {
        const newMarker = {
          id: id,
          longitude: location[0],
          latitude: location[1],
          showPopup: false
        }
        id++;
        onSearch(result);
        setMarkers(() => [...markers, newMarker])
        }
    });
    return null;
  }

  const onMapLoad = useCallback(() => {
    mapRef.current.on('load', function () {
      mapRef.current.resize();
    });
  });


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


  const zoomToMarker = (e, id) => {
    let index = markers.findIndex((marker => marker.id == id));
    let longitude = 0;
    let latitude = 0;
    if (index === -1) {
      index = placeSuggestions.findIndex((place => place.xid == id));
      longitude = placeSuggestions[index].longitude;
      latitude = placeSuggestions[index].latitude;
    } else {
      longitude = markers[index].longitude;
      latitude = markers[index].latitude;
    }
    flyTo(longitude, latitude);
  }

  const markerClick = (e, id, longitude, latitude) => {
    changeCurrentMarker(id, "1");
    flyTo(longitude, latitude);
  }

  const placeSuggestionClick = ((e, xid, longitude, latitude) => {
    changeCurrentMarker(xid, "2");
    flyTo(longitude, latitude)
  })

  const flyTo = (longitude, latitude) => {
    mapRef.current.flyTo({
      center: [longitude, latitude],
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
  }

  const createMarker = (e) => {
    if (commentMarkerCreation && commentMarkerCreation != null && mapRef.current.getZoom() > 9) {
      const suggestion = {
        markerId: currentMarker,
        longitude: e.lngLat.lng,
        latitude: e.lngLat.lat,
        type: commentMarkerCreation
      }
      //commentMarker created, but not offically
      // setCommentMarkers(() => [...commentMarkers, suggestion])
      setNewSuggestion(suggestion)
      setCreateSuggestion(true);
      onCommentMarkerCreate(e);
    }
  };

  const cancelCreate = (e) => {
    setCreateSuggestion(false);
  }

  return (
      <ReactMapGL
        className="map"
        initialViewState={viewport}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        maxZoom={14}
        mapboxAccessToken={accessToken}
        ref={mapRef}
        onLoad={onMapLoad}
        onClick={createMarker}
        renderChildrenInPortal={true}
        >
        <Geocoder
          accessToken={accessToken}
          mapboxgl={mapboxgl} position="top-right"
          >
        </Geocoder>
        {markers.map((marker) => (
          <div key={marker.id}>
            <Marker 
              key={`marker-id-lng${marker.longitude + `lat` + marker.latitude}`} 
              className="marker" longitude={marker.longitude} latitude={marker.latitude} 
              onClick={(e) => markerClick(e, marker.id, marker.longitude, marker.latitude)} 
              anchor="bottom" 
              color="#8c9cd8">
            </Marker>
          </div>
        ))} 
        {placeSuggestions && placeSuggestions.map((placeSuggestion) => (
          <Marker 
            key={`marker-id-lng${placeSuggestion.longitude + `lat` + placeSuggestion.latitude}`} 
            className="marker" longitude={placeSuggestion.longitude} latitude={placeSuggestion.latitude} 
            onClick={(e) => placeSuggestionClick(e, placeSuggestion.xid, placeSuggestion.longitude, placeSuggestion.latitude)} 
            anchor="bottom" 
            color="#4f1b26">
          </Marker>
        ))}       
        {commentMarkers.map((commentMarker) => (
          <Suggestion
            suggestion={commentMarker}
            username={username}
            removeSuggestion={removeSuggestion}
            journeyOwner={journeyOwner}
          />
        ))} 
        {createSuggestion && (<CreateSuggestion
            longitude={newSuggestion.longitude}
            latitude={newSuggestion.latitude}
            type={newSuggestion.type}
            markerId={newSuggestion.markerId}
            cancelCreate={cancelCreate}
            submitSuggestion={onCommentMarkerSubmit}
            setErrorSnackbar={setErrorSnackbar}
        />)}    
      </ReactMapGL>
  );
}


