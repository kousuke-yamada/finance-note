import { Box, Drawer, Toolbar } from "@mui/material";
import React, { CSSProperties, isValidElement } from "react";
import Divider from "@mui/material/Divider";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import HomeIcon from "@mui/icons-material/Home";
import BarChartIcon from "@mui/icons-material/BarChart";
import { NavLink } from "react-router-dom";

interface SideBarProps {
  drawerWidth: number;
  mobileOpen: boolean;
  handleDrawerClose: () => void;
  handleDrawerTransitionEnd: () => void;
}

interface menuItem {
  text: string;
  path: string;
  icon: React.ComponentType;
}

const SideBar = ({
  drawerWidth,
  mobileOpen,
  handleDrawerClose,
  handleDrawerTransitionEnd,
}: SideBarProps) => {
  const MenuItems: menuItem[] = [
    { text: "Home", path: "/", icon: HomeIcon },
    { text: "Report", path: "/report", icon: BarChartIcon },
  ];

  const baseLinkStyle: CSSProperties = {
    textDecoration: "none",
    color: "inherit",
    display: "block",
  };

  const activeLinkStyle: CSSProperties = {
    backgroundColor: "rgba(0, 0, 0, 0.08)",
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {MenuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            style={({ isActive }) => {
              return { ...baseLinkStyle, ...(isActive ? activeLinkStyle : {}) };
            }}
          >
            <ListItem key={index} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                  <item.icon />
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          </NavLink>
        ))}
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      aria-label="mailbox folders"
    >
      {/* モバイル用 */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
        slotProps={{
          root: {
            keepMounted: true, // Better open performance on mobile.
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* PC用 */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default SideBar;
