import { ListItemButton, ListItemText, ListItemAvatar } from "@mui/material";
import { Avatar } from "@mui/material";
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import { blue } from '@mui/material/colors';
import { IconButton } from '@mui/material';
import Typography from '@mui/material/Typography';
import React, { useState, useCallback } from 'react';
import { format } from 'date-fns'

export function Marker(props) {
    const { currentMarker, marker, handleChange, handleContentOpen } = props;
    return (
        <ListItemButton selected={currentMarker == marker.id} onClick={(e) => handleChange(e, marker.id)} alignItems="flex-start">
            <ListItemAvatar>
                <Avatar>
                    <BeachAccessIcon sx={{ color: blue[500] }} />
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={marker.place}
                secondary={
                    <React.Fragment>
                        <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                        >
                            {format(new Date(marker.date * 1), 'yyyy-MM-dd')}
                        </Typography>
                        <IconButton disabled={!(currentMarker == marker.id)} onClick={handleContentOpen}>
                            <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="blue"
                            >Read more
                            </Typography>
                        </IconButton>
                    </React.Fragment>
                }
            />
        </ListItemButton>
    );
}