import {styled} from "@mui/material/styles"
import { AppBar, Toolbar, Typography, Box, InputBase, Avatar, Menu} from "@mui/material";
import Co2Icon from '@mui/icons-material/Co2';
import Badge from "@mui/material/Badge";
import MailIcon from '@mui/icons-material/Mail';
import Notifications from '@mui/icons-material/Notifications';
import React, { useState } from "react";
import MenuItem from '@mui/material/MenuItem';

const StyledToolbar = styled(Toolbar)({
    display:"flex",
    justifyContent:"space-between"
});

const Search = styled("div")(({ theme }) => ({
    backgroundColor: "white",
    padding:"0 10px",
    borderRadius: 5,
    width:"40%"
}));

const Icons = styled(Box)(({ theme }) => ({
     display: "none", alignItems:"center", gap:"20px", [theme.breakpoints.up('sm')]: {
        display: 'flex',
    }
}));

const UserBox = styled(Box)(({ theme }) => ({ 
    display: "flex", alignItems:"center", gap:"10px", [theme.breakpoints.up('sm')]: {
        display: 'none',
    }
}));
const Navbar = () => {
    const [open, setOpen] = useState(false)
    return (
        <AppBar position="sticky">
            <StyledToolbar>
                <Typography variant="h6" sx={{display:{xs:"none", sm:"block"}}}>
                    Vidi-Lab Website
                </Typography>
            <Co2Icon sx={{display:{xs:"block", sm:"none"}}}/>
                <Search><InputBase placeholder="Search..."/></Search>
                <Icons>
                    <Badge badgeContent={4} color="error">
                        <MailIcon  />
                    </Badge>
                    <Badge badgeContent={2} color="error">
                        <Notifications/>
                    </Badge>
                    <Avatar
                            sx={{width: 30, height: 30}}
                            src = "https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_1.25/c_scale,w_500/Microsites/Xenoblade%20Chronicles%203/xc3_pmp_character01_noah"
                            onClick={e=>setOpen(true)}
                        />    
                </Icons>
                <UserBox>
                    <Avatar
                        sx={{width: 30, height: 30}}
                        src = "https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_1.25/c_scale,w_500/Microsites/Xenoblade%20Chronicles%203/xc3_pmp_character01_noah"
                        onClick={e=>setOpen(true)}
                    />
                    <Typography>Noah Xenoblade</Typography>   
                </UserBox>
            </StyledToolbar>
            <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                open={open}
                onClose={(e)=>setOpen(false)}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem >Profile</MenuItem>
                <MenuItem >My account</MenuItem>
                <MenuItem >Logout</MenuItem>        
            </Menu>
         </AppBar>
    )
}

export default Navbar