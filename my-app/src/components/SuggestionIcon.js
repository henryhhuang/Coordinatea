import PublicIcon from '@mui/icons-material/Public';
import PlaceIcon from '@mui/icons-material/Place';
import HotelIcon from '@mui/icons-material/Hotel';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { Avatar } from '@mui/material';

export function SuggestionIcon (props) {
    const { type } = props;

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
        <Avatar sx={{backgroundColor: "#d78cc1"}}>
            {renderIcon(type)}
        </Avatar>
    )

}