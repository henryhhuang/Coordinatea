import Container from '@mui/material/Container';
import PublicIcon from '@mui/icons-material/Public';
import PlaceIcon from '@mui/icons-material/Place';
import HotelIcon from '@mui/icons-material/Hotel';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { Avatar } from '@mui/material';
import {Popup, Marker} from 'react-map-gl';
import {SuggestionContent} from '../SuggestionContent/SuggestionContent';
import { useState } from 'react';

export function Suggestion (props) {
    const {suggestion} = props;

    const [popup, setPopup] = useState();
    
    //todo: refactor
    const renderIcon = (type) => {
        switch(type) {
            case 'hotel':
                return <HotelIcon/>
            case 'restaurant':
                return <RestaurantIcon/>
            case 'tourist':
                return <PlaceIcon/>
            default:
                return <PublicIcon/>
        }
    }

    return (
        <div>
            {popup && (
            <Popup key={`popup-id-` + suggestion.id} longitude={suggestion.longitude} latitude={suggestion.latitude+0.01}
                className="popup"
                anchor="bottom"
                closeOnClick={false}
                onClose={() => setPopup(false)}>
                <SuggestionContent
                description={suggestion.description}
                imageId={suggestion.imageId}
                />
            </Popup>)}
                <Marker color="orange" 
                key={`marker-id-lng${suggestion.longitude + `lat` + suggestion.latitude}`} 
                className="marker" longitude={suggestion.longitude} 
                latitude={suggestion.latitude} 
                onClick={(e) => setPopup(true)} 
                anchor="bottom" >
                    <Avatar sx={{backgroundColor: "orange"}}>
                    {renderIcon(suggestion.type)}
                    </Avatar>
            </Marker>
            </div>
    )
}