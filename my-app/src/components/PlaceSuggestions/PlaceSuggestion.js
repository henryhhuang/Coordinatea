import { Divider } from "@mui/material";
import { List } from "@mui/material";
import RoomIcon from '@mui/icons-material/Room';
import { Stack } from "@mui/material";
import { PlaceSuggestion } from "../PlaceSuggestion/PlaceSuggestion";

export function PlaceSuggestions(props) {
    const { placeSuggestions, currentMarker, handleChange, addMarker} = props;

    return (
        <List sx={{paddingTop: "0px", overflow: 'auto', width: '100%'}}>
            {placeSuggestions.length === 0 ? (
                <Stack sx={{display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap'}}>
                    There are no suggestions near this location
                    <RoomIcon/>
                </Stack>
            ) : (
                placeSuggestions.map((placeSuggestion) => (
                    placeSuggestion && (
                    <div key={'list-' + placeSuggestion.xid} className="marker-container">
                        <PlaceSuggestion 
                            placeSuggestion={placeSuggestion}
                            currentMarker={currentMarker}
                            handleChange={handleChange}
                            addMarker={addMarker}></PlaceSuggestion>
                        <Divider variant="inset" component="li" />
                    </div>)
            )))}
        </List>
    );
}