import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/** Firebase configuration */
const firebaseConfig = {
  apiKey: "AIzaSyBcowcIQEhs03Dp2y2u9k8JiP6wZ3P-RT0",
  authDomain: "finance-note-ba422.firebaseapp.com",
  projectId: "finance-note-ba422",
  storageBucket: "finance-note-ba422.firebasestorage.app",
  messagingSenderId: "874600060455",
  appId: "1:874600060455:web:28eb14a3d81f80f3746002",
};

/** Initialize Firebase */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { db, auth, provider };

/** Firebase Authentication エラーコード */
export enum FirebaseAuthErrorCode {
  // メールアドレスでのログインエラー
  USER_NOT_FOUND = "auth/user-not-found", // ユーザーが存在しません
  WRONG_PASSWORD = "auth/wrong-password", // パスワードが間違っています
  EMAIL_ALREADY_IN_USE = "auth/email-already-in-use", // このメールアドレスはすでに使われています
  INVALID_EMAIL = "auth/invalid-email", // 無効なメールアドレス形式です
  TOO_MANY_REQUESTS = "auth/too-many-requests", // 試行回数が多すぎます（ロックアウト）
  USER_DISABLED = "auth/user-disabled", // アカウントが無効化されています
  INVALID_CREDENTIAL = "auth/invalid-credential", // 認証情報が無効（メールアドレスまたはパスワードが間違っています）
  // Googleログインやポップアップ処理時のエラー
  POPUP_CLOSED_BY_USER = "auth/popup-closed-by-user", // ユーザーがポップアップを閉じました
  POPUP_BLOCKED = "auth/popup-blocked", // ポップアップがブラウザにブロックされました
  CANCELLED_POPUP_REQUEST = "auth/cancelled-popup-request", // 別のポップアップ処理と競合しました
  OPERATION_NOT_ALLOWED = "auth/operation-not-allowed", // Firebase コンソール側で該当ログイン方式が無効です
  ACCOUNT_EXISTS_WITH_DIFFERENT_CREDENTIAL = "auth/account-exists-with-different-credential", // 他の認証方法で登録済みのアカウントがあります
  NETWORK_REQUEST_FAILED = "auth/network-request-failed", // ネットワークエラーが発生しました
  INTERNAL_ERROR = "auth/internal-error", // Firebase 内部エラーが発生しました（稀）
}
