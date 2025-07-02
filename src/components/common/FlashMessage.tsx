import { Snackbar, Alert } from "@mui/material";

/**
 * FlashMessageコンポーネントの Props 型定義
 * @property {boolean} open - フラッシュメッセージ表示状態
 * @property {string} message - フラッシュメッセージの内容
 * @property {"success" | "error" | "info" | "warning"} [severity] - フラッシュメッセージ種類（任意）
 * @property {() => void} onClose - フラッシュメッセージ：クローズ時のコールバック関数
 */
interface FlashMessageProps {
  open: boolean;
  message: string;
  severity?: "success" | "error" | "info" | "warning";
  onClose: () => void;
}

/******************************************************
 * FlashMessage Component
 *
 * @description フラッシュメッセージ表示用のコンポーネント。
 * FlashMessageコンテキスト経由で表示する。
 ******************************************************/
const FlashMessage = ({
  open,
  message,
  severity = "info",
  onClose,
}: FlashMessageProps) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default FlashMessage;
