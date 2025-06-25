import React from "react";
import { Snackbar, Alert } from "@mui/material";

interface FlashMessageProps {
  open: boolean;
  message: string;
  severity?: "success" | "error" | "info" | "warning";
  onClose: () => void;
}

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
