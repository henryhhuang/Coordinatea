import { ListItemText, ListItemAvatar } from "@mui/material";
import MuiListItemButton from '@mui/material/ListItemButton';
import { withStyles } from "@material-ui/core/styles";
import { Avatar } from "@mui/material";
import Typography from '@mui/material/Typography';
import React from 'react';
import RoomIcon from '@mui/icons-material/Room';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';

const ListItemButton = withStyles({
    root: {
      "&$selected": {
        backgroundColor: '#8c9cd8'
      }
    },
    selected: {}
  })(MuiListItemButton);

export function PlaceSuggestion(props) {
    const { placeSuggestion, currentMarker, handleChange, addMarker} = props;

    return (
        <ListItemButton selected={currentMarker == placeSuggestion.xid} onClick={(e) => handleChange(placeSuggestion.xid)} alignItems="flex-start">
            <ListItemAvatar>
                <Avatar color="primary" sx={{backgroundColor: "#4f1b26"}}>
                    <RoomIcon/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={
                    <React.Fragment>
                        <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            color="text.primary"
                        >
                            {placeSuggestion.name}
                        </Typography>

                    </React.Fragment>
                }
                secondary={
                    <React.Fragment>
                        <Typography
                            sx={{ display: 'flex' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                        >
                            10km away
                        </Typography>
                    </React.Fragment>
                }
            />
            <ListItemAvatar>
                <Avatar color="primary" sx={{backgroundColor: "#1b264f"}} 
                    onClick={(() => addMarker(placeSuggestion.name, placeSuggestion.longitude, placeSuggestion.latitude))}>
                    <AddCircleOutline/>
                </Avatar>
            </ListItemAvatar>
        </ListItemButton>
    );
}