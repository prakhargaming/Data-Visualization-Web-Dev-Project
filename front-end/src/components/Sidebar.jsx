import React from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import Divider from '@mui/material/Divider';
import DraftsIcon from '@mui/icons-material/Drafts';
import AndroidIcon from '@mui/icons-material/Android';
import BackHandIcon from '@mui/icons-material/BackHand';
import ContactlessIcon from '@mui/icons-material/Contactless';
import { Box } from "@mui/material";
import { useState, useEffect } from 'react';


function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

function Sidebar (isD3) {
    const { height, width } = getWindowDimensions();  
    // const [isActive, setIsActive] = useState(false);
    return (
        <Box bgcolor="#D3D3D3" flex={1} p={2} sx={{display: { xs: "none", sm: "block"}, height:{height}}}>
            <nav aria-label="main mailbox folders">
            <List>
                <ListItem disablePadding>
                    <ListItemButton component="a" href = "#home">
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Home Page" />
                    </ListItemButton>
                </ListItem>
                {/* <ListItem disablePadding onClick={() => setIsActive(!isActive)}> */}
                <ListItem disablePadding>
                    <ListItemButton component="a" href = "#ok">
                    <ListItemIcon>
                        <BackHandIcon />
                    </ListItemIcon>
                    <ListItemText primary="D3 Hirearchy Tree" />
                    </ListItemButton>
                </ListItem><ListItem disablePadding>
                    <ListItemButton component="a" href = "#slay">
                    <ListItemIcon>
                        <ContactlessIcon />
                    </ListItemIcon>
                    <ListItemText primary="Groups" />
                    </ListItemButton>
                </ListItem><ListItem disablePadding>
                    <ListItemButton component="a" href = "#awesome">
                    <ListItemIcon>
                        <AndroidIcon />
                    </ListItemIcon>
                    <ListItemText primary="Market Place" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <DraftsIcon />
              </ListItemIcon>
              <ListItemText primary="Drafts" />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
      <Divider />
      <nav aria-label="secondary mailbox folders">
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Trash" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component="a" href="#simple-list">
              <ListItemText primary="New" />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </Box> 
    );
};

export default Sidebar