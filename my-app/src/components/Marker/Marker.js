import { ListItemText, ListItemAvatar } from "@mui/material";
import MuiListItemButton from '@mui/material/ListItemButton';
import { withStyles } from "@material-ui/core/styles";
import { Avatar } from "@mui/material";
import { IconButton } from '@mui/material';
import Typography from '@mui/material/Typography';
import React from 'react';
import { format } from 'date-fns'
import DeleteIcon from '@mui/icons-material/Delete';
import RoomIcon from '@mui/icons-material/Room';

const ListItemButton = withStyles({
    root: {
      "&$selected": {
        backgroundColor: '#8c9cd8'
      }
    },
    selected: {}
  })(MuiListItemButton);

export function Marker(props) {
    const { currentMarker, marker, handleChange, handleContentOpen, username, journeyOwner, removeMarker} = props;

    return (
        <ListItemButton selected={currentMarker == marker.id} onClick={(e) => handleChange(marker.id)} alignItems="flex-start">
            <ListItemAvatar>
                <Avatar color="primary" sx={{backgroundColor: "#1b264f"}}>
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
                            {marker.place}
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
                            {format(new Date(marker.date * 1), 'yyyy-MM-dd')}
                        </Typography>
                        <IconButton sx={{padding: "0px"}} disabled={!(currentMarker == marker.id)} onClick={((e) => {handleContentOpen(e, marker)})}>
                            <Typography
                                sx={{ display: 'inline', fontWeight: 'bold' }}
                                component="span"
                                variant="body2"
                                color="primary"
                            >Read more
                            </Typography>
                        </IconButton>
                        {journeyOwner && journeyOwner === username &&
                            <IconButton onClick={((e) => removeMarker(e, marker.id))}>
                                <DeleteIcon></DeleteIcon>
                            </IconButton>
                        }
                    </React.Fragment>
                }
            />
        </ListItemButton>
    );
}