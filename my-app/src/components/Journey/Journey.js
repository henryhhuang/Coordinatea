import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Container } from '@mui/material';
import { format } from 'date-fns'
import "./Journey.css"

export function Journey(props) {
    const { journey, username, removeJourney } = props;

    let toDate = format(new Date(journey.toDate * 1), 'yyyy-MM-dd')
    let fromDate = format(new Date(journey.fromDate * 1), 'yyyy-MM-dd')

    return (
        <Container className="journey-card" backgroundColor="primary.main" sx={{display: "flex", flexDirection: "row", maxWidth: 500, boxShadow: 1, backgroundColor: "#f4f4f9"}}>
            <Container sx={{flexDirection: "column", paddingBottom: "40px"}}>
                <CardHeader
                    titleTypographyProps={{variant: 'h6', align: 'left'}}
                    subheaderTypographyProps={{variant: 'body2', align: 'left'}}
                    title={journey.title}
                    subheader={fromDate + ' to ' + toDate}
                />
                {journey.imageId &&
                    <CardMedia
                        className="img"
                        component="img"
                        height="194"
                        image={process.env.NODE_ENV === "production" ? "https://api.coordinatea.me/api/image/" + journey.imageId + "/" :
                            "http://localhost:5000/api/image/" + journey.imageId + "/"}
                        alt="Failed to retrieve image"
                    />
                }
            </Container>
                <Container sx={{flexDirection: "column", paddingBottom: "40px", margin:"20px"}}>
                    <CardContent sx={{maxHeight: "400px", overflow: "auto"}}>
                        <Typography align='left' variant="body1" color="text.secondary">
                            {journey.description}
                        </Typography>
                    </CardContent>
                    <CardContent>
                        <Typography variant="body2" align='left' color="text.secondary">
                        posted by {journey.username}
                        </Typography>
                    </CardContent>
                    <CardActions sx={{paddingTop: 4}} disableSpacing>
                        {journey.username === username &&
                        <IconButton onClick={((e) => {
                            e.preventDefault() 
                            removeJourney(journey.id)})} aria-label="delete">
                            <DeleteIcon/>
                        </IconButton>
                        }    
                    </CardActions>
                </Container>
            </Container>
    )
}