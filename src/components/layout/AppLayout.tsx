import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import SideBar from "../common/SideBar";
import { Avatar, Button, CSSProperties } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";

const drawerWidth = 240;

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const baseLinkStyle: CSSProperties = {
    textDecoration: "none",
    color: "inherit",
    display: "block",
  };

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("ログアウトに失敗しました", error);
    }
  };

  return (
    <Box
      sx={{
        display: { md: "flex" },
        bgcolor: (theme) => theme.palette.grey[100],
        minHeight: "100vh",
      }}
    >
      <CssBaseline />
      {/* ヘッダー */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, textAlign: "left" }}
          >
            Finance Note
          </Typography>

          {user ? (
            <MemberModeHeader
              name={user.displayName}
              photoPath={user.photoURL}
              onLogout={handleLogout}
            />
          ) : (
            <GuestModeHeader />
          )}
        </Toolbar>
      </AppBar>

      {/* サイドバー */}
      <SideBar
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        handleDrawerClose={handleDrawerClose}
        handleDrawerTransitionEnd={handleDrawerTransitionEnd}
      />

      {/* メインコンテンツ */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

function GuestModeHeader() {
  return (
    <>
      {/* 名前 */}
      <Typography variant="subtitle1">ゲスト さん</Typography>
      {/* ログインボタン */}
      <Button
        component={Link}
        to="/login"
        color={"warning"}
        variant="contained"
        sx={{ ml: 1 }}
      >
        ログイン
      </Button>
    </>
  );
}

interface MemberModeHeaderProps {
  name: string | null;
  photoPath: string | null;
  onLogout: () => Promise<void>;
}

function MemberModeHeader({
  name,
  photoPath,
  onLogout,
}: MemberModeHeaderProps) {
  return (
    <>
      {/* 写真 */}
      {photoPath && (
        <Avatar alt="Google Photo" src={photoPath} sx={{ mr: 1 }} />
      )}
      {/* ユーザー名 */}
      {name && <Typography variant="subtitle1">{name} さん</Typography>}

      {/* ログアウトボタン */}
      <Button
        color={"info"}
        variant="contained"
        sx={{ ml: 1 }}
        onClick={onLogout}
      >
        ログアウト
      </Button>
    </>
  );
}
