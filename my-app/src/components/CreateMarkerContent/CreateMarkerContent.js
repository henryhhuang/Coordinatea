import Container from '@mui/material/Container';
import { Typography } from '@mui/material';
import './CreateMarkerContent.css'
import { CardMedia } from '@mui/material';
import { IconButton } from '@mui/material';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { useRef } from 'react';

//todo add image form
export function CreateMarkerContent (props) {
    const {handleSubmit, handleBack, title, images, description} = props;

    const titleRef = useRef(null);
    const descriptionRef = useRef(null);

    const validateSubmit = (e) => {
        e.preventDefault();
        //validation
        const title = titleRef.current.value;
        const description = descriptionRef.current.value
        handleSubmit(e, title, description);
    }

    return (
        <form onSubmit={validateSubmit}>
        <Container className="create-marker-content" maxWidth="sm">
            <IconButton onClick={handleBack}>
                <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="blue"
                    >
                    Cancel changes
                </Typography>
            </IconButton>
            <TextField sx={{width: '80%', paddingBottom:'20px'}}
                required
                id="outlined-required"
                label="Required"
                defaultValue="Title"
                inputRef={titleRef}
            />
            <TextField sx={{width: '80%', paddingBottom:'20px'}}
                required
                multiline
                rows={8}
                id="outlined-required"
                label="Required"
                defaultValue="Title"
                inputRef={descriptionRef}
            />
            <Button type='submit' variant="outlined" size="medium">
                Save Marker
            </Button>

            {/* onClick={(e) => zoomToPopup(e, marker.id)}  */}
            {/* <CardMedia component="img" image={"/" + images[0].url}></CardMedia> */}
            {/* <Typography variant="body1">{description}</Typography> */}
        </Container>
        </form>
    )
}