import { Button, Typography } from "@mui/material";
import { getAuthErrorMessage, userGoogleLogin } from "../../utils/auth";
import { useFlashMessage } from "../../contexts/FlashMessageContext";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { FirebaseAuthErrorCode } from "../../firebase";

/******************************************************
 * GoogleAuth Component
 *
 * @description Google連携によるログイン処理を行うコンポーネント。
 * Googleプロバイダー経由のログインボタンを表示する。
 * Firebase Authenticationに対してGoogle認証でログインする。
 ******************************************************/
const GoogleAuth = () => {
  const { showFlashMessage } = useFlashMessage();
  const navigate = useNavigate();

  /** Google認証処理 */
  const handleGoogleAuth = async () => {
    await userGoogleLogin()
      .then(() => {
        showFlashMessage("ログインしました", "success");
        navigate("/"); // Homeページへ遷移
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
