import {
  AppBar,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./Sidebar";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import logo from "../../images/dashboard.png";

const useStyle = makeStyles({
  header: {
    paddingLeft: 260,
    "@media (max-width:960px)": {
      paddingLeft: "0px",
    },
  },
  hamburger: {
    "@media (max-width:960px)": {
      marginLeft: "0px",
    },
  },
  responsiveSidebar: {
    marginTop: 25,
  },
});

const Header = (props) => {
  // console.log(props);
  const classes = useStyle();
  const [openMenu, setOpenMenu] = useState(false);
  if (props.openSidebar) {
    setOpenMenu(props.openSidebar);
  }

  const openData = (data) => {
    setOpenMenu(data);
  };
  // console.log(openMenu);
  const handleClick = (e) => {
    setOpenMenu(!openMenu);
  };
  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            className={classes.hamburger}
            sx={{ mr: 2 }}
          >
            <MenuIcon onClick={handleClick} />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            className={classes.header}
          >
            DASHBOARD COMPANY ABC
          </Typography>
        </Toolbar>
      </AppBar>
      {openMenu && (
        <div className={classes.responsiveSidebar}>
          <Sidebar openSidebar={openData} user={props.user} />
        </div>
      )}
    </div>
  );
};

export default Header;
