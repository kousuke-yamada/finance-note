import { Button, Typography } from "@mui/material";
import React from "react";
import { getAuthErrorMessage, userGoogleLogin } from "../../utils/auth";
import { useFlashMessage } from "../../contexts/FlashMessageContext";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { FirebaseAuthErrorCode } from "../../firebase";

const GoogleAuth = () => {
  const { showFlashMessage } = useFlashMessage();
  const navigate = useNavigate();

  const handleGoogleAuth = async () => {
    await userGoogleLogin()
      .then(() => {
        console.log("Google認証でログインしました。");
        showFlashMessage("ログインしました", "success");

        // Homeページへ遷移
        navigate("/");
      })
      .catch((error) => {
        if (error instanceof FirebaseError) {
          const message = getAuthErrorMessage(
            error.code as FirebaseAuthErrorCode
          );
          console.error(message, error);
          showFlashMessage(message, "error");
        } else {
          console.error("予期せぬエラーによりGoogleログイン失敗", error);
          showFlashMessage(
            "予期せぬエラーによりGoogleログインに失敗しました",
            "error"
          );
        }
      });
  };

  return (
    <Button
      onClick={handleGoogleAuth}
      variant="outlined"
      sx={{
        width: { xs: "100%", lg: 750 },
        borderRadius: "50px", // 丸枠
        backgroundColor: "#f5f5f5", // グレー背景
        border: "1px solid #aaa", // 濃いグレー枠
        color: "black",
        textTransform: "none",
        mx: "auto",
        px: 2,
        py: 1,
        "&:hover": {
          backgroundColor: "#e0e0e0",
        },
      }}
    >
      <Typography
        component="img"
        src="/google_mark.png"
        alt="Google logo"
        sx={{
          width: 40,
          height: 40,
        }}
      ></Typography>
    </Button>
  );
};

export default GoogleAuth;
