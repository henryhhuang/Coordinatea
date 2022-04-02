import { Marker } from "../Marker/Marker";
import { Divider } from "@mui/material";
import { List } from "@mui/material";

export function Markers(props) {
    const { markers, currentMarker, handleChange, handleContentOpen, username, journeyOwner, removeMarker} = props;

    return (
        <List sx={{paddingTop: "0px", overflow: 'auto', width: '100%'}}>
            {markers.map((marker) => (
                marker && (
                <div key={'list-' + marker.id} className="marker-container">
                    <Marker 
                        marker={marker}
                        handleChange={handleChange}
                        handleContentOpen={handleContentOpen}
                        currentMarker={currentMarker}
                        username={username}
                        journeyOwner={journeyOwner}
                        removeMarker={removeMarker}></Marker>
                    <Divider variant="inset" component="li" />
                </div>)
            ))}
        </List>
    );
}