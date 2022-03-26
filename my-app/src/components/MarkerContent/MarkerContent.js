import Container from '@mui/material/Container';
import { Typography } from '@mui/material';
import './MarkerContent.css'
import { CardMedia } from '@mui/material';
import { IconButton } from '@mui/material';

//Todo: once edit to use real image once image upload is completed
export function MarkerContent (props) {
    const {handleBack, title, images, description} = props;
    return (
        <Container className="marker-content" maxWidth="sm">
            <IconButton onClick={handleBack}>
                <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="blue"
                    >
                        Go back
                </Typography>
            </IconButton>
            <Typography variant="h2">{title}</Typography>
            <CardMedia component="img" image={"https://api.coordinatea.me/api/image/" + images + "/"}></CardMedia>

            <Typography variant="body1">{description}</Typography>
        </Container>
    )
}