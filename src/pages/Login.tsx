import { getAdditionalUserInfo, signInWithPopup, User } from "firebase/auth";
import React from "react";
import { auth, db, provider } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useFlashMessage } from "../contexts/FlashMessageContext";

const Login = () => {
  // const [user] = useAuthState(auth);
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

// 認証プロバイダの定義
type Provider = "google";

// ユーザー情報の型定義
interface UserData {
  uid: string;
  displayName: string | null;
  email: string | null;
  provider: Provider;
  photoURL: string | null;
  createAt: any;
  lastLoginAt: any;
}

// ログインボタン
function SignInButton() {
  const navigate = useNavigate();
  const { showFlashMessage } = useFlashMessage();

  // Googleログイン処理
  const handleGoogleLogin = async (): Promise<void> => {
    try {
      // ① firebase Authenticationへ、Googleログイン
      const result = await signInWithPopup(auth, provider);
      const loggedInUser = result.user;

      console.log("ログイン成功", loggedInUser);

      // ② Firestore Databaseへユーザー情報を設定
      await handleUserData(loggedInUser);
      console.log("②まで完了", loggedInUser.uid);

      showFlashMessage("ログインに成功しました", "success");

      // ③ Homeページへ遷移
      navigate("/");
    } catch (error) {
      console.error("ログイン失敗", error);
      showFlashMessage("ログインに失敗しました", "error");
    } finally {
    }
  };

  // ユーザー情報設定処理（新規/既存ユーザー判定）
  const handleUserData = async (user: User): Promise<void> => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      console.log("ログインしようとしているユーザーID", user.uid);

      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        console.log("ドキュメントあり");
        // 既存ユーザーの場合 ： ログイン時刻を更新
        console.log("既存ユーザー", user.uid);

        await updateDoc(userDocRef, {
          lastLoginAt: serverTimestamp(),
        });
        console.log("ログイン時刻を更新");
      } else {
        // 新規ユーザーの場合 ： ドキュメントを新規作成
        console.log("新規ユーザー", user.uid);

        const newUserData: UserData = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          provider: "google",
          photoURL: user.photoURL,
          createAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        };
        await setDoc(userDocRef, newUserData);
        console.log("新規ユーザーのドキュメント追加");
      }
    } catch (error) {
      console.error("ユーザーデータ処理エラー", error);
    }
  };

  return (
    <button onClick={handleGoogleLogin}>
      <p>Googleでサインイン</p>
    </button>
  );
}
