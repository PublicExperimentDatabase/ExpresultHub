import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

const Navbar = () => {
  return (
    <AppBar position="sticky" color="primary" sx={{ top: 0, left: 0, right: 0, zIndex: 100 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Logo
        </Typography>
        <div>
          {/* <Button color="inherit">Home</Button>
          <Button color="inherit">About</Button>
          <Button color="inherit">History</Button>
          <Button color="inherit">Contact</Button> */}
          <Button variant="contained" href="/experiments">
            Get Started
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
