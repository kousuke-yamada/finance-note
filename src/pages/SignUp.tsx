import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { auth, FirebaseAuthErrorCode } from "../firebase";
import { userSignUpSchema, SignUpSchema } from "../validations/schema";
import { zodResolver } from "@hookform/resolvers/zod";

import { getAuthErrorMessage, userEmailSignUp } from "../utils/auth";
import { useFlashMessage } from "../contexts/FlashMessageContext";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import GoogleAuth from "../components/common/GoogleAuth";

const SignUp = () => {
  const { showFlashMessage } = useFlashMessage();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignUpSchema>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(userSignUpSchema),
  });

  const onSubmit: SubmitHandler<SignUpSchema> = async (data) => {
    await userEmailSignUp(data)
      .then(() => {
        console.log("ユーザー新規登録しました");
        showFlashMessage("ユーザー登録成功しました", "success");

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
          console.error("予期せぬエラーによりユーザー登録失敗", error);
          showFlashMessage(
            "予期せぬエラーによりユーザー登録に失敗しました",
            "error"
          );
        }
      });
    reset({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
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
        アカウント作成
      </Typography>
      <Typography>以下のいずれかの方法でご登録ください</Typography>
      <Divider
        sx={{
          mx: "auto",
          my: 3,
          width: { xs: "100%", lg: 750 },
          maxWidth: 750,
        }}
      >
        メールアドレスで登録
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
          {/* ユーザー名 */}
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="ユーザー名"
                type="text"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                error={!!errors.name}
                helperText={errors.name?.message}
                fullWidth
                required
              />
            )}
          />

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

          {/* パスワード（確認用） */}
          <Controller
            name="confirmPassword"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="パスワード（確認用）"
                type="password"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                required
              />
            )}
          />

          {/* 保存ボタン */}
          <Button type="submit" variant="contained" color={"primary"} fullWidth>
            アカウント作成
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
        Google連携で登録
      </Divider>

      {/* Google認証 */}
      <GoogleAuth />

      <Typography sx={{ mt: 4 }} fontWeight={"fontWeightMedium"}>
        アカウントをお持ちの方は <Link to="/signin">こちら</Link>
      </Typography>
    </Box>
  );
};

export default SignUp;
