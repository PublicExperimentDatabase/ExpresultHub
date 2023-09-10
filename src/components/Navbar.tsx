import React from "react";
import { AppBar, Toolbar, Typography, Button, Link, Box } from "@mui/material";

const Navbar = () => {
  return (
    <AppBar position="sticky" color="primary" sx={{ top: 0, left: 0, right: 0, zIndex: 100 }}>
      <Toolbar>
      <Link href="/">
      <Box
        component="img"
        sx={{ height: 100 }}
        alt="Logo"
        src="https://i.postimg.cc/NG1PkjKK/Untitled-3.png"
      />
      
    </Link>
        <div style={{marginLeft:"75%"}}>
          <Button color="inherit" href="/experiments">Home</Button>
          <Button color="inherit" href="/experiments/visualise">Visualise</Button>
          <Button color="inherit">About</Button>
          
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
