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

//todo id from backend when markers are saved
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
    journeyOwner} = props;

  const [markers, setMarkers] = useState([]);
  const [marker, setMarker] = useState(0);
  const [commentMarkers, setCommentMarkers] = useState([]);
  const [image, setImage] = useState();
  const descriptionRef = useRef(null);
  const [newSuggestion, setNewSuggestion] = useState();
  const [createSuggestion, setCreateSuggestion] = useState();

  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 13.8161,
    zoom: 0.64
  });

  const mapRef = useRef(null);

  //the below useEffects checks if parent props have been changed and if so updates this component
  //todo: it might be inefficient for currentMarker
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
    // if (mapRef && mapRef.current && markers.length != 0) {
        currentMarker = props.currentMarker
        setMarker(currentMarker)
        zoomToPopup(null, currentMarker);
    }
  }, [props.currentMarker])

  // useEffect(() => {//once the data is loaded and marker is not null, zoom to the marker
  //   if (mapRef && mapRef.current) {
  //     console.log(markers);
  //     console.log(marker);
  //     if (marker != 0 && markers.length != 0) {
  //       console.log(markers);
  //       console.log(marker)
  //       zoomToPopup(null, marker);
  //     }
  //   }
  // }, [markers])

  //can refactor to its own component
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

  const zoomToPopup = useCallback((e, id) => {
    changeCurrentMarker(null, id);
    setMarker(id)

    let index = markers.findIndex((marker => marker.id == id));
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
        maxZoom={11}
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
            <Marker key={`marker-id-lng${marker.longitude + `lat` + marker.latitude}`} className="marker" longitude={marker.longitude} latitude={marker.latitude} onClick={(e) => zoomToPopup(e, marker.id)} anchor="bottom" >
            </Marker>
          </div>
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
        />)}    
      </ReactMapGL>
  );
}


