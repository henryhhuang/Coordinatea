import { Marker } from "../Marker/Marker";
import { Divider } from "@mui/material";
import { List } from "@mui/material";

export function Markers(props) {
    const { markers, currentMarker, handleChange, handleContentOpen } = props;

    return (
        <List sx={{ maxHeight: '800px', overflow: 'auto', width: '100%', bgcolor: 'background.paper' }}>
            {markers.map((marker) => (
                marker && (
                <div key={'list-' + marker.id} className="marker-container">
                    <Marker 
                        marker={marker}
                        handleChange={handleChange}
                        handleContentOpen={handleContentOpen}
                        currentMarker={currentMarker}></Marker>
                    <Divider variant="inset" component="li" />
                </div>)
            ))}
        </List>
    );
}