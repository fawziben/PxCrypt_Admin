import { useEffect, useState } from "react";
import { alpha } from "@mui/material/styles";
import { Box, Avatar, IconButton, Popover } from "@mui/material";
import UserProfile from "./UserProfile"; // Import the UserProfile component
import { axiosInstance } from "../AxiosInstance";

export default function Compte() {
  const account = {
    username: "Fawzi Ben",
    email: "admin@gmail.com",
    type: "chercheur",
  };

  const [parentimg, setParentImg] = useState("");

  async function getCurrentUser() {
    try {
      let accessToken = localStorage.getItem("token");

      const response = await axiosInstance.get(`users/current/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 200) {
        console.log(response.data);
        setParentImg(response.data.img_src);
        console.log(parentimg);
      }
    } catch (e) {
      alert(e);
    }
  }

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            "&:before": {
              zIndex: 1,
              content: "''",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              position: "absolute",
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar sx={{ backgroundColor: "#C27821" }}>
          <img src={parentimg} alt="Profile" />
        </Avatar>
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 300, // Adjusted width to fit content
            "& .MuiMenuItem-root": {
              typography: "body2",
              borderRadius: 0.75,
            },
          },
        }}
      >
        <UserProfile account={account} onClose={handleClose} />
      </Popover>
    </>
  );
}
