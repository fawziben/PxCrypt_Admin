import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { axiosInstance } from "../AxiosInstance";

export default function PasswordDialog({ open, setOpen }) {
  const [oPassword, setOPassword] = useState("");
  const [nPassword, setNPassword] = useState("");
  const [cnPassword, setCNPassword] = useState("");

  const handleCloseDialog = () => {
    setOpen(false);
  };

  async function handleReset(mail, setEditEmail) {
    try {
      let accessToken = localStorage.getItem("token");
      if (nPassword === cnPassword) {
        const response = await axiosInstance.put(
          `reset/password`,
          { old_password: oPassword, new_password: nPassword },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.status == 200) {
          alert("success");
        } else {
          console.log("internal server error");
        }
      } else {
        setOpen(false);
        alert("The password does not match");
      }
    } catch (e) {
      alert(e);
    }
  }

  return (
    <div>
      <Dialog open={open} onClose={handleCloseDialog}>
        <div className="w-[400px]">
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Reset Password{" "}
          </DialogTitle>
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          ></DialogTitle>
          <DialogContent>
            <TextField
              sx={{ width: "100%" }}
              label="Old Password"
              type="password"
              onChange={(e) => setOPassword(e.target.value)}
              minRows={3}
            />
            <br />
            <br />
            <TextField
              sx={{ width: "100%" }}
              label="New Password"
              type="password"
              onChange={(e) => setNPassword(e.target.value)}
            />
            <br />
            <br />
            <TextField
              sx={{ width: "100%" }}
              label="Confirm Password"
              type="password"
              onChange={(e) => setCNPassword(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={handleReset}>
              Reset
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </div>
  );
}
