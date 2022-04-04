import { Popup, Marker } from 'react-map-gl';
import { SuggestionContent } from '../SuggestionContent/SuggestionContent';
import { useState } from 'react';
import { SuggestionIcon } from '../SuggestionIcon';

export function Suggestion (props) {
    const {suggestion, username, removeSuggestion, journeyOwner} = props;

    const canDelete = suggestion.username === username || journeyOwner === username;

    const [popup, setPopup] = useState();

    const removePopup = (e, suggestionId) => {
        setPopup(false);
        removeSuggestion(e, suggestionId)
    }

    return (
        <div>
            {popup && (
                <Popup key={`popup-id-` + suggestion.id} longitude={suggestion.longitude} latitude={suggestion.latitude+0.001}
                    className="popup"
                    anchor="bottom"
                    closeOnClick={false}
                    onClose={() => setPopup(false)}>
                    <SuggestionContent
                    suggestionId={suggestion.id}
                    description={suggestion.description}
                    imageId={suggestion.imageId}
                    username={suggestion.username}
                    canDelete={canDelete}
                    removeSuggestion={removePopup}
                    journeyOwner={journeyOwner}
                    />
                </Popup>)}
                    <Marker color="orange" 
                    key={`marker-id-lng${suggestion.longitude + `lat` + suggestion.latitude}`} 
                    className="marker" longitude={suggestion.longitude} 
                    latitude={suggestion.latitude} 
                    onClick={(e) => setPopup(true)} 
                    anchor="bottom" >
                        <SuggestionIcon
                            type={suggestion.type}
                        />
                </Marker>
            </div>
    )
}