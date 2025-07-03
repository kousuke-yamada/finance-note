import { Box, Drawer, Toolbar } from "@mui/material";
import React, { CSSProperties } from "react";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import BarChartIcon from "@mui/icons-material/BarChart";
import { NavLink } from "react-router-dom";

/**
 * SideBarコンポーネントの Props 型定義
 * @property {number} drawerWidth - サイドバー幅
 * @property {boolean} mobileOpen - モバイル用：サイドバーDrawerの開閉状態
 * @property {() => void} handleDrawerClose - モバイル用：サイドバーDrawerクローズ時のコールバック関数
 * @property {() => void} handleDrawerTransitionEnd - モバイル用：サイドバーDrawer開閉アニメーション完了時のコールバック関数
 */
interface SideBarProps {
  drawerWidth: number;
  mobileOpen: boolean;
  handleDrawerClose: () => void;
  handleDrawerTransitionEnd: () => void;
}
/**
 * サイドメニュー項目の型定義
 * @property {string} text - 表示テキスト
 * @property {string} path - ルートパス
 * @property {React.ComponentType} icon - メニューアイコン（MUIコンポーネント）
 */
interface menuItem {
  text: string;
  path: string;
  icon: React.ComponentType;
}

/******************************************************
 * SideBar Component
 *
 * @description サイドバー表示用のコンポーネント。
 ******************************************************/
const SideBar = ({
  drawerWidth,
  mobileOpen,
  handleDrawerClose,
  handleDrawerTransitionEnd,
}: SideBarProps) => {
  /** サイドメニュー項目一覧 */
  const MenuItems: menuItem[] = [
    { text: "Home", path: "/", icon: HomeIcon },
    { text: "Report", path: "/report", icon: BarChartIcon },
  ];

  /** サイドメニュー：非選択項目のスタイル定義 */
  const baseLinkStyle: CSSProperties = {
    textDecoration: "none",
    color: "inherit",
    display: "block",
  };
  /** サイドメニュー：選択項目のスタイル定義 */
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
            keepMounted: true,
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
