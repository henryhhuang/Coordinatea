import Container from '@mui/material/Container';
import PublicIcon from '@mui/icons-material/Public';
import PlaceIcon from '@mui/icons-material/Place';
import HotelIcon from '@mui/icons-material/Hotel';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { Avatar } from '@mui/material';
import {Popup, Marker} from 'react-map-gl';
import { useState, useRef } from 'react';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import "./CreateSuggestion.css";

export function CreateSuggestion (props) {
    const {longitude, latitude, type, markerId, cancelCreate, submitSuggestion, setErrorSnackbar} = props;

    const [selectedImage, setSelectedImage] = useState();
    const descriptionRef = useRef();

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

    const validateSubmit = (e) => {
        e.preventDefault();
        if (!descriptionRef.current.value || !selectedImage) {
            setErrorSnackbar("A description is required")
            return;
        }
        submitSuggestion(markerId, descriptionRef.current.value, selectedImage, longitude, latitude, type)
        cancelCreate();
    }

    return (
        <div key="create-marker-container">
            <Popup key={"create-suggestion-popup"} longitude={longitude} latitude={latitude+0.01}
            className="popup"
            anchor="bottom"
            closeOnClick={false}
            onClose={() => cancelCreate()}
            >
                <form className="create-marker-container" onSubmit={validateSubmit}>
                    <TextField size='small' sx={{width: '90%'}}
                        required
                        multiline
                        rows={7}
                        id="outlined-required"
                        label="Required"
                        defaultValue="Description"
                        inputRef={descriptionRef}
                    />
                    <Button
                    variant="outlined"
                    component="label"
                    size="small"
                    >
                    Upload File
                    <input
                        type="file"
                        hidden
                        onChange={((e) => {setSelectedImage(e.target.files[0])})}
                    />
                    </Button>
                    <Button type='submit' variant="outlined" size="small" sx={{color: "black"}}>
                        Save Comment
                    </Button>
                </form>
            </Popup>
        <Marker color="orange" 
            key={`create-marker-id-lng${longitude + `lat` + latitude}`} 
            className="marker" longitude={longitude} 
            latitude={latitude} 
            anchor="bottom" >
                <Avatar sx={{backgroundColor: "orange"}}>
                    {renderIcon(type)}
                </Avatar>
        </Marker>
        </div>
    )
}