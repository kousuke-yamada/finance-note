import { signInWithPopup } from "firebase/auth";
import React from "react";
import { auth, provider } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [user] = useAuthState(auth);
  const drawerWidth = 240;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <h1>Googleログイン</h1>
      <SignInButton />
    </Box>
  );
};

export default Login;

// ログインボタン
function SignInButton() {
  const navigate = useNavigate();
  const signInWithGoogle = async () => {
    // firebaseを使ってGoogleでログインする
    try {
      const result = await signInWithPopup(auth, provider);
      if (!!result) {
        navigate("/");
      }
    } catch (error) {
      console.error("ログイン失敗：error");
    }
  };

  return (
    <button onClick={signInWithGoogle}>
      <p>Googleでサインイン</p>
    </button>
  );
}
