import * as React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import PhotoIcon from '@mui/icons-material/Photo';

const Feed = ({isActive}) => {
return (
        <Box flex={4} p={2} sx={{ '& > :not(style)': { m: 1 }}}>
            <Fab color="primary" variant="extended" >
                <PhotoIcon sx={{ mr: 1 }} />
                Photo 1
            </Fab>
            <Fab variant="extended" color="secondary">
                <PhotoIcon sx={{ mr: 1 }} />
                Photo 2
            </Fab>
            <Fab variant="extended" color="#158">
                <PhotoIcon sx={{ mr: 1 }} />
                Photo 3     
            </Fab>
        </Box>
        );
    }

export default Feed

