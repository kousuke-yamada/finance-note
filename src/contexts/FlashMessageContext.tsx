import { createContext, ReactNode, useContext, useState } from "react";
import FlashMessage from "../components/common/FlashMessage";

/**
 * FlashMessageコンテキストの 型定義
 * @property {(
    message: string,
    severity?: "success" | "error" | "info" | "warning"
  ) => void} showFlashMessage - フラッシュメッセージ表示関数（
 * @param {string} message - 表示するメッセージのテキスト
 * @param {"success" | "error" | "info" | "warning"} [severity] - フラッシュメッセージの種類
 */
interface FlashMessageContextType {
  showFlashMessage: (
    message: string,
    severity?: "success" | "error" | "info" | "warning"
  ) => void;
}

/** FlashMessageコンテキスト */
const FlashMessageContext = createContext<FlashMessageContextType | undefined>(
  undefined
);

/** useFlashMessage カスタムフック
 *. Contextから値を取得して返す。Provider内でのみ有効。
 */
export const useFlashMessage = () => {
  const context = useContext(FlashMessageContext);
  if (!context)
    throw new Error("useFlashMessage must be used within FlashMessageProvider");

  return context;
};

/******************************************************
 * FlashMessageProvider Component
 *
 * @description フラッシュメッセージを使用可能にするためのコンポーネント。
 * アプリ全体をこのProviderでラップし、どこからでも参照できるようにする。
 ******************************************************/
export const FlashMessageProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  /** フラッシュメッセージ表示処理 */
  const showFlashMessage = (
    msg: string,
    sev: "success" | "error" | "info" | "warning" = "info"
  ) => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  /** フラッシュメッセージ閉じた時の処理 */
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <FlashMessageContext.Provider value={{ showFlashMessage }}>
      {children}
      <FlashMessage
        open={open}
        message={message}
        severity={severity}
        onClose={handleClose}
      />
    </FlashMessageContext.Provider>
  );
};

export default FlashMessageContext;
