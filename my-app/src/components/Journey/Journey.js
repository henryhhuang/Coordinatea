import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Container } from '@mui/material';
import { format } from 'date-fns'
import EventIcon from '@mui/icons-material/Event';
import { Switch } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import { Chip } from '@mui/material';
import "./Journey.css"
import { Link } from 'react-router-dom';

export function Journey(props) {
    const { journey, username, removeJourney } = props;

    const renderJourneyType = (type) => {
        if (type === "PREVIOUS") {
            return <Chip disabled={true} color="secondary" label="Past Journey" icon={<FlightLandIcon />} />
        } else {
            return <Chip disabled={true} color="secondary" label="Journey Plan" icon={<EventIcon />} />
        }
    }

    let toDate = format(new Date(journey.toDate * 1), 'yyyy-MM-dd')
    let fromDate = format(new Date(journey.fromDate * 1), 'yyyy-MM-dd')

    return (
        <Container className="journey-card" sx={{ display: "flex", flexDirection: "row", maxWidth: 500, boxShadow: 1, borderRadius: 4, borderColor: 'primary.main', backgroundColor: "#f6f7fc" }}>
            <Container sx={{ flexDirection: "column", paddingBottom: "40px" }}>
                <CardHeader
                    titleTypographyProps={{ variant: 'h6', align: 'left' }}
                    subheaderTypographyProps={{ variant: 'body2', align: 'left' }}
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
            <Container sx={{ flexDirection: "column", paddingBottom: "40px", margin: "20px" }}>
                <CardContent sx={{ maxHeight: "400px", overflow: "auto" }}>
                    <Typography align='left' variant="body1" color="text.primary">
                        {journey.description}
                    </Typography>
                </CardContent>
                <CardContent>
                    <Typography variant="body2" align='left' color="text.secondary">
                        <Link to={"/profile/" + journey.username} style={{ color: 'black' }}>
                            posted by {journey.username}
                        </Link>
                    </Typography>

                </CardContent>
                <CardActions sx={{ paddingTop: 4 }} disableSpacing>
                    <FormControlLabel disabled={true} onClick={((e) => e.preventDefault())} onChange={((e) => e.stopPropagation())} control={<Switch color="secondary" checked={journey.suggestionsEnabled} />} label="Suggestions"></FormControlLabel>
                    {renderJourneyType(journey.journeyType)}
                    {journey.username === username &&
                        <IconButton onClick={((e) => {
                            e.preventDefault()
                            removeJourney(journey.id)
                        })} aria-label="delete">
                            <DeleteIcon color="secondary" />
                        </IconButton>
                    }
                </CardActions>
            </Container>
        </Container>
    )
}