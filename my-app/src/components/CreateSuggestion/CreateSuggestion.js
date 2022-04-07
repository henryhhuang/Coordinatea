import { Popup, Marker } from 'react-map-gl';
import { useState, useRef } from 'react';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { SuggestionIcon } from '../SuggestionIcon';
import "./CreateSuggestion.css";

export function CreateSuggestion(props) {
    const { longitude, latitude, type, markerId, cancelCreate, submitSuggestion, setErrorSnackbar } = props;

    const [selectedImage, setSelectedImage] = useState();
    const descriptionRef = useRef();

    const validateSubmit = (e) => {
        e.preventDefault();
        if (!descriptionRef.current.value) {
            setErrorSnackbar("A description is required")
            return;
        }
        submitSuggestion(markerId, descriptionRef.current.value, selectedImage, longitude, latitude, type)
        cancelCreate();
    }

    return (
        <div key="create-marker-container">
            <Popup key={"create-suggestion-popup"} longitude={longitude} latitude={latitude + 0.001}
                className="popup"
                anchor="bottom"
                closeOnClick={false}
                onClose={() => cancelCreate()}
            >
                <form className="create-marker-container" onSubmit={validateSubmit}>
                    <TextField size='small' sx={{ width: '90%' }}
                        required
                        multiline
                        rows={7}
                        id="outlined-required"
                        label="Required"
                        placeholder="Description"
                        inputRef={descriptionRef}
                    />
                    <Button
                        variant="outlined"
                        component="label"
                        size="small"
                    >
                        Upload File (max 2mb)
                        <input
                            type="file"
                            hidden
                            onChange={((e) => { setSelectedImage(e.target.files[0]) })}
                        />
                    </Button>
                    <Button type='submit' variant="outlined" size="small" sx={{ color: "black" }}>
                        Save Comment
                    </Button>
                </form>
            </Popup>
            <Marker color="orange"
                key={`create-marker-id-lng${longitude + `lat` + latitude}`}
                className="marker" longitude={longitude}
                latitude={latitude}
                anchor="bottom" >
                <SuggestionIcon
                    type={type}
                />
            </Marker>
        </div>
    )
}