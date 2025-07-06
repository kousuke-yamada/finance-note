import {
  AppBar,
  Avatar,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { User } from "firebase/auth";
import { Link } from "react-router-dom";

/**
 * Headerコンポーネントの Props 型定義
 * @property {User | null | undefined} user - ログインユーザー
 * @property {number} drawerWidth - サイドバー幅
 * @property {() => void} handleDrawerToggle - モバイル用：ハンバーガーメニュー押下時のコールバック関数
 * @property {() => Promise<void>} handleLogout - ログアウトボタン押下時のコールバック関数
 */
interface HeaderProps {
  user: User | null | undefined;
  drawerWidth: number;
  handleDrawerToggle: () => void;
  handleLogout: () => Promise<void>;
}

/******************************************************
 * Header Component
 *
 * @description ヘッダー表示用のコンポーネント。
 * ユーザーログイン時と、非ログイン時（ゲストモード）で表示切り替え
 ******************************************************/
const Header = ({
  user,
  drawerWidth,
  handleDrawerToggle,
  handleLogout,
}: HeaderProps) => {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        bgcolor: "#424242",
      }}
    >
      <Toolbar>
        {/* モバイル用：ハンバーガーメニュー */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        {/* タイトル */}
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, textAlign: "left" }}
        >
          Finance Note
        </Typography>

        {/* ユーザー名 / ログイン・ログアウトボタン */}
        {user ? (
          // メンバーモード （ログイン状態）
          <MemberModeHeader
            name={user.displayName}
            photoPath={user.photoURL}
            onLogout={handleLogout}
          />
        ) : (
          // ゲストモード （ログアウト状態）
          <GuestModeHeader />
        )}
      </Toolbar>
    </AppBar>
  );
};

/******************************************************
 * GuestModeHeader Component
 *
 * @description ゲストモード用のヘッダー情報。
 * ユーザー名：「ゲスト」 と、　ログインボタンを表示する。
 ******************************************************/
function GuestModeHeader() {
  return (
    <>
      {/* 名前 */}
      <Typography variant="subtitle1">ゲスト さん</Typography>
      {/* ログインボタン */}
      <Button
        component={Link}
        to="/signin"
        color={"warning"}
        variant="contained"
        sx={{ ml: 1 }}
      >
        ログイン
      </Button>
    </>
  );
}

/**
 * Headerコンポーネントの Props 型定義
 * @property {string | null} name - ユーザー名
 * @property {string | null} photoPath - プロフィール画像パス
 * @property {() => Promise<void>} onLogout - ログアウトボタン押下時のコールバック関数
 */
interface MemberModeHeaderProps {
  name: string | null;
  photoPath: string | null;
  onLogout: () => Promise<void>;
}

/******************************************************
 * MemberModeHeader Component
 *
 * @description メンバーモード用のヘッダ情報。
 * ログイン中のユーザーの名前、プロフィール画像、及び、ログアウトボタンを表示する。
 * プロフィール画像はGoogle認証でのログイン時のみ有効。
 ******************************************************/
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

export default Header;
