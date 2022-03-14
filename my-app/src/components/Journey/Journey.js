import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

export function Journey(props) {
    const { journey } = props;

    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardActionArea>
                <CardMedia
                component="img"
                height="140"
                image="japan.jpeg"
                alt="green iguana"
                />
                <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {journey.title}
                </Typography>
                <Typography gutterBottom variant="h5" component="div">
                    {journey.username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {journey.short_description}
                </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}