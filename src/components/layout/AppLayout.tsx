import { useState } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "../common/SideBar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { useFlashMessage } from "../../contexts/FlashMessageContext";
import Header from "../common/Header";

/** サイドバーの画面幅 */
const drawerWidth = 240;

/******************************************************
 * AppLayout Component
 *
 * @description 画面レイアウト表示用のコンポーネント。
 * 全ページに共通のヘッダー・サイドバー・メインコンテンツ部分の枠組みを設定。
 ******************************************************/
const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const { showFlashMessage } = useFlashMessage();

  /** モバイル用:サイドバーDrawerクローズ時の処理 */
  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };
  /** モバイル用：サイドバーDrawer開閉アニメーション完了時の処理 */
  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  /** モバイル用：ハンバーガーメニュー押下時の処理 */
  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  /** ログアウトボタン押下時の処理（ユーザーログイン状態） */
  const handleLogout = async () => {
    try {
      // Firebase Authenticationからログアウト
      await signOut(auth);
      showFlashMessage("ログアウトしました", "success");
      // ログインページへ遷移
      navigate("/signin");
    } catch (error) {
      console.error("ログアウトに失敗しました", error);
      showFlashMessage("ログアウトに失敗しました", "error");
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
      <Header
        user={user}
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle}
        handleLogout={handleLogout}
      />

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
};

export default AppLayout;
