import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import GroupIcon from "@mui/icons-material/Group";
import Home from "@mui/icons-material/Home";
import { withRouter } from "react-router";
import { Grid, makeStyles, Paper } from "@material-ui/core";
import DashboardIcon from "@mui/icons-material/Dashboard";
import userImage from "../../images/amar.PNG";
import defaultUserImage from "../../images/default-person.png";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
const drawerWidth = 300;

const useStyle = makeStyles({});

function Sidebar(props) {
  const { history, user } = props;
  const navItem = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      onClick: () => {
        if (props.openSidebar != undefined) {
          props.openSidebar(false);
        }
        history.push("/dashboard");
      },
    },
    {
      text: "Category",
      icon: <ListAltIcon />,
      onClick: () => {
        if (props.openSidebar != undefined) {
          props.openSidebar(false);
        }
        history.push("/category");
      },
    },
    {
      text: "Products",
      icon: <ListAltIcon />,
      onClick: () => {
        if (props.openSidebar != undefined) {
          props.openSidebar(false);
        }
        history.push("/product");
      },
    },
    {
      text: "Customers",
      icon: <GroupIcon />,
      onClick: () => {
        if (props.openSidebar != undefined) {
          props.openSidebar(false);
        }
        history.push("/customer");
      },
    },
    {
      text: "Orders",
      icon: <ShoppingCartIcon />,
      onClick: () => {
        if (props.openSidebar != undefined) {
          props.openSidebar(false);
        }
        history.push("/order");
      },
    },

    {
      text: "Change Password",
      icon: <SettingsApplicationsIcon />,
      onClick: () => {
        if (props.openSidebar != undefined) {
          props.openSidebar(false);
        }
        history.push("/change-password");
      },
    },

    {
      text: "Signout",
      icon: <LogoutIcon />,
      onClick: () => {
        if (props.openSidebar != undefined) {
          props.openSidebar(false);
        }
        localStorage.setItem("userInfo", []);
        window.location.reload(false);
        history.push("/signin");
      },
    },
  ];
  const navItemSimple = [
    {
      text: "Signin",
      icon: <LoginIcon />,
      onClick: () => {
        if (props.openSidebar != undefined) {
          props.openSidebar(false);
        }
        history.push("/signin");
      },
    },
    {
      text: "Signup",
      icon: <AccountCircleIcon />,
      onClick: () => {
        if (props.openSidebar != undefined) {
          props.openSidebar(false);
        }
        history.push("/signup");
      },
    },
  ];
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Box sx={{ overflow: "auto" }}>
          <List>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <Grid item>
                <img
                  src={user.user_name ? userImage : defaultUserImage}
                  width="70"
                  height="70"
                  style={{ borderRadius: "50%" }}
                />
              </Grid>
              <Grid item>
                <b style={{ fontSize: "12px" }}>
                  {user.user_name && user.user_name}
                </b>
              </Grid>
              <Grid item style={{ fontSize: "12px" }}>
                Backend Developer
              </Grid>
            </Grid>
            <br />
            <Divider />
            {user.user_name ? (
              <>
                {" "}
                {navItem.map((item) => {
                  const { text, icon, onClick } = item;
                  return (
                    <ListItem button key={text} onClick={onClick}>
                      <ListItemIcon>{icon}</ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItem>
                  );
                })}
              </>
            ) : (
              <>
                {" "}
                {navItemSimple.map((item) => {
                  const { text, icon, onClick } = item;
                  return (
                    <ListItem button key={text} onClick={onClick}>
                      <ListItemIcon>{icon}</ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItem>
                  );
                })}
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
export default withRouter(Sidebar);
