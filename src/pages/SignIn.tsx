import { FirebaseAuthErrorCode } from "../firebase";
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useFlashMessage } from "../contexts/FlashMessageContext";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { userSignInSchema, SignInSchema } from "../validations/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAuthErrorMessage, userEmailSignIn } from "../utils/auth";
import { FirebaseError } from "firebase/app";
import GoogleAuth from "../components/common/GoogleAuth";

/******************************************************
 * SignIn Component
 *
 * @description ログインページを表示するコンポーネント
 ******************************************************/
const SignIn = () => {
  const { showFlashMessage } = useFlashMessage();
  const navigate = useNavigate();

  // ログインフォームの初期化とバリデーション設定
  // - Zod スキーマ（SignInSchema）によるバリデーション
  // - email/password の初期値を定義
  // - フォーム操作用の関数（control, handleSubmit, reset など）を取得
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignInSchema>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(userSignInSchema),
  });

  /** ログインボタン押下時（フォーム内容送信時）の処理 */
  const onSubmit: SubmitHandler<SignInSchema> = async (data) => {
    await userEmailSignIn(data)
      .then(() => {
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
          console.error("予期せぬエラーによりログイン失敗", error);
          showFlashMessage(
            "予期せぬエラーによりログインに失敗しました",
            "error"
          );
        }
      });
    reset({
      email: "",
      password: "",
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "50vh",
        borderRadius: 2,
        boxShadow: 1,
        m: 4,
        p: 4,
      }}
      bgcolor="white"
      textAlign={"center"}
    >
      <Typography
        sx={{ fontSize: { xs: ".8rem", sm: "1rem", md: "2rem" }, m: 2 }}
        component="h1"
        fontWeight={"fontWeightBold"}
      >
        ログイン
      </Typography>
      <Typography>以下のいずれかの方法でログインしてください</Typography>
      <Divider
        sx={{
          mx: "auto",
          my: 3,
          width: { xs: "100%", lg: 750 },
          maxWidth: 750,
        }}
      >
        メールアドレスでログイン
      </Divider>

      {/* フォーム要素 */}
      <Box
        component={"form"}
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          width: { xs: "100%", lg: 750 },
          maxWidth: 750,
          mx: "auto",
          mt: 1,
          mb: 4,
        }}
      >
        <Stack spacing={3}>
          {/* メールアドレス */}
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="メールアドレス"
                type="email"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
                required
              />
            )}
          />

          {/* パスワード */}
          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="パスワード"
                type="password"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                error={!!errors.password}
                helperText={errors.password?.message}
                required
              />
            )}
          />

          {/* 保存ボタン */}
          <Button type="submit" variant="contained" color={"primary"} fullWidth>
            ログイン
          </Button>
        </Stack>
      </Box>

      <Divider
        sx={{
          mx: "auto",
          my: 3,
          width: { xs: "100%", lg: 750 },
          maxWidth: 750,
        }}
      >
        Google連携でログイン
      </Divider>

      {/* Google認証 */}
      <GoogleAuth />

      <Typography sx={{ mt: 4 }} fontWeight={"fontWeightMedium"}>
        アカウントの新規登録は <Link to="/signup">こちら</Link>
      </Typography>
    </Box>
  );
};

export default SignIn;
