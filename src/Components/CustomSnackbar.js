import React from "react";
import { Snackbar, Alert } from "@mui/material";

const CustomSnackbar = ({
  open,
  message,
  severity,
  onClose,
  anchorOrigin = { vertical: "bottom", horizontal: "center" },
}) => {
  // Déterminez la position du Snackbar en fonction du paramètre anchorOrigin
  const position = anchorOrigin.left
    ? { vertical: "bottom", horizontal: "left" }
    : anchorOrigin;

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={position}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
