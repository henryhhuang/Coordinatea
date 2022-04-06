import Container from '@mui/material/Container';
import { Typography } from '@mui/material';
import { IconButton } from '@mui/material';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { useRef, useState } from 'react';
import './CreateMarkerContent.css'

export function CreateMarkerContent (props) {
    const {handleSubmit, handleBack, setErrorSnackbar} = props;

    const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);
    const titleRef = useRef(null);
    const descriptionRef = useRef(null);

    const fileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setIsFilePicked(true);
    }

    const validateSubmit = (e) => {
        e.preventDefault();
        const title = titleRef.current.value;
        const description = descriptionRef.current.value;
        if (!title || !description) {
            setErrorSnackbar("A title and description are required.")
            return;
        }
        handleSubmit(e, title, description, selectedFile);
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
                defaultValue="Description"
                inputRef={descriptionRef}
            />
                <Button
                variant="contained"
                component="label"
                >
                Upload File
                <input
                    type="file"
                    hidden
                    onChange={fileChange}
                />
            </Button>
            <Button type='submit' variant="outlined" size="medium">
                Save Marker
            </Button>
        </Container>
        </form>
    )
}