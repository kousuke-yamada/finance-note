import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  User,
} from "firebase/auth";
import { auth, db, FirebaseAuthErrorCode, provider } from "../firebase";
import { useFlashMessage } from "../contexts/FlashMessageContext";
import { useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { ProviderType, UserData } from "../types";
import { SignUpSchema, SignInSchema } from "../validations/schema";

// サインアップ処理（メールアドレス）
export async function userEmailSignUp(userData: SignUpSchema): Promise<void> {
  try {
    // ① firebase Authenticationへ、Emailでアカウント作成
    const result = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    const newUser = result.user;
    // プロフィール更新
    await updateProfile(newUser, { displayName: userData.name });

    console.log("ユーザー登録成功", newUser);

    // ② Firestore Databaseへユーザー情報を設定
    await setUserData(newUser, "email", userData.name);
    console.log("②まで完了", newUser.uid);
  } catch (error) {
    console.error("メールアドレスでのユーザー登録失敗", error);
    throw error;
  }
}

// サインイン処理（メールアドレス）
export async function userEmailSignIn(userData: SignInSchema): Promise<void> {
  try {
    // ① firebase Authenticationへ、Emailでアカウント作成
    const result = await signInWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    const loggedInUser = result.user;

    console.log("ログイン成功", loggedInUser);

    // ② Firestore Databaseへユーザー情報を設定
    await setUserData(loggedInUser, "email");
    console.log("②まで完了", loggedInUser.uid);
  } catch (error) {
    console.error("メールアドレスでのログイン失敗", error);
    throw error;
  }
}

// サインアップ・サインイン処理（Google認証）
export async function userGoogleLogin(): Promise<void> {
  try {
    // ① firebase Authenticationへ、Googleログイン
    const result = await signInWithPopup(auth, provider);
    const loggedInUser = result.user;

    console.log("ログイン成功", loggedInUser);

    // ② Firestore Databaseへユーザー情報を設定
    await setUserData(loggedInUser, "google");
    console.log("Firestoreへユーザーデータ追加完了", loggedInUser.uid);
  } catch (error) {
    console.error("ログイン失敗", error);
    throw error;
  }
}

// ユーザー情報設定処理（新規/既存ユーザー判定）
const setUserData = async (
  user: User,
  providerType: ProviderType,
  userName?: string
): Promise<void> => {
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
        displayName: userName ? userName : user.displayName,
        email: user.email,
        provider: providerType,
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

// FirebaseAuthエラーコード取得処理
export const getAuthErrorMessage = (code: FirebaseAuthErrorCode): string => {
  switch (code) {
    case FirebaseAuthErrorCode.USER_NOT_FOUND:
      return "ユーザーが見つかりません。このメールアドレスは登録されていません。";

    case FirebaseAuthErrorCode.WRONG_PASSWORD:
      return "パスワードが間違っています。";

    case FirebaseAuthErrorCode.EMAIL_ALREADY_IN_USE:
      return "既に使用されているメールアドレスです。";

    case FirebaseAuthErrorCode.INVALID_EMAIL:
      return "無効な形式のメールアドレスです。";

    case FirebaseAuthErrorCode.TOO_MANY_REQUESTS:
      return "ログイン試行が制限されました。時間をおいてもう一度お試しください。";

    case FirebaseAuthErrorCode.INVALID_CREDENTIAL:
      return "メールアドレスまたはパスワードが間違っています";

    case FirebaseAuthErrorCode.POPUP_CLOSED_BY_USER:
      return "ユーザーによりログインがキャンセルされました";

    case FirebaseAuthErrorCode.POPUP_BLOCKED:
      return "ポップアップがブロックされました。ブラウザの設定をご確認ください。";

    case FirebaseAuthErrorCode.CANCELLED_POPUP_REQUEST:
      return "別のポップアップ処理と競合しました";

    case FirebaseAuthErrorCode.OPERATION_NOT_ALLOWED:
      return "Firebaseのコンソール側で該当ログイン方式が無効です";

    case FirebaseAuthErrorCode.ACCOUNT_EXISTS_WITH_DIFFERENT_CREDENTIAL:
      return "他の認証方法で登録済みのアカウントがあります。";

    case FirebaseAuthErrorCode.NETWORK_REQUEST_FAILED:
      return "ネットワークエラーが発生しました。";

    case FirebaseAuthErrorCode.INTERNAL_ERROR:
      return "Firebaseの内部エラーが発生しました";

    default:
      return "ログインに失敗しました。";
  }
};
