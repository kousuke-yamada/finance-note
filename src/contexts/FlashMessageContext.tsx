import React, { createContext, ReactNode, useContext, useState } from "react";
import FlashMessage from "../components/common/FlashMessage";

interface FlashMessageContextType {
  showFlashMessage: (
    message: string,
    severity?: "success" | "error" | "info" | "warning"
  ) => void;
}

const FlashMessageContext = createContext<FlashMessageContextType | undefined>(
  undefined
);

export const useFlashMessage = () => {
  const context = useContext(FlashMessageContext);
  if (!context)
    throw new Error("useFlashMessage must be used within FlashMessageProvider");

  return context;
};

export const FlashMessageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  const showFlashMessage = (
    msg: string,
    sev: "success" | "error" | "info" | "warning" = "info"
  ) => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

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
