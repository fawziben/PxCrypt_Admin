import { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Button,
  TextField,
  Stack,
  IconButton,
} from "@mui/material";
import { Done, Edit } from "@mui/icons-material";
import { blue } from "@mui/material/colors";
import PasswordDialog from "./PasswordDialog";

const UserProfile = ({ account, onClose }) => {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [image, setImage] = useState("path/to/static/image.jpg");
  const [firstName, setFirstName] = useState("Fawzi");
  const [lastName, setLastName] = useState("Ben");
  const [email, setEmail] = useState("admin@gmail.com");
  const [editName, setEditName] = useState(true);
  const [editLName, setEditLName] = useState(true);
  const [editEmail, setEditEmail] = useState(true);

  const handleEditClick = () => {
    setEditMode(true);
  };
  const handleAddClick = () => {
    setOpen(true);
  };
  const handleSaveClick = () => {
    // Add save logic here
    setEditMode(false);
  };

  const handleCancelClick = () => {
    setEditMode(false);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ p: 2, width: 300 }}>
      <Stack spacing={2} alignItems="center">
        <Box sx={{ position: "relative" }}>
          {image ? (
            <Avatar
              sx={{ width: 100, height: 100 }}
              src={image}
              alt="Profile"
            />
          ) : (
            <Avatar
              sx={{ width: 100, height: 100, backgroundColor: blue[200] }}
            >
              <Typography sx={{ fontSize: "40px" }}>
                {firstName[0] + " " + lastName[0]}
              </Typography>
            </Avatar>
          )}
          {editMode && (
            <IconButton
              component="label"
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                bgcolor: "background.paper",
                "&:hover": {
                  bgcolor: "grey.300",
                },
              }}
            >
              <Edit />
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </IconButton>
          )}
        </Box>
        <Typography variant="h6">{firstName}</Typography>
        <Typography variant="body2">{email}</Typography>
        {editMode ? (
          <>
            <div className="flex" style={{ alignItems: "center" }}>
              <TextField
                sx={{
                  "& .MuiInputBase-root": {
                    height: "50px", // Set your desired height here
                  },
                }}
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                fullWidth
                disabled={editName}
              />
              <IconButton
                component="label"
                sx={{
                  marginLeft: "20px",
                  bgcolor: "background.paper",
                  "&:hover": {
                    bgcolor: "grey.300",
                  },
                }}
              >
                {editName ? (
                  <Edit onClick={() => setEditName(false)} />
                ) : (
                  <Done
                    onClick={() => {
                      console.log("First Name Updated");
                      setEditName(true);
                    }}
                  />
                )}
              </IconButton>{" "}
            </div>
            <div className="flex" style={{ alignItems: "center" }}>
              <TextField
                sx={{
                  "& .MuiInputBase-root": {
                    height: "50px", // Set your desired height here
                  },
                }}
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                fullWidth
                disabled={editLName}
              />
              <IconButton
                component="label"
                sx={{
                  marginLeft: "20px",
                  bgcolor: "background.paper",
                  "&:hover": {
                    bgcolor: "grey.300",
                  },
                }}
              >
                {editLName ? (
                  <Edit onClick={() => setEditLName(false)} />
                ) : (
                  <Done
                    onClick={() => {
                      console.log("Last Name Updated");
                      setEditLName(true);
                    }}
                  />
                )}
              </IconButton>{" "}
            </div>
            <div className="flex" style={{ alignItems: "center" }}>
              <TextField
                sx={{
                  "& .MuiInputBase-root": {
                    height: "50px", // Set your desired height here
                  },
                }}
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                disabled={editEmail}
              />
              <IconButton
                component="label"
                sx={{
                  marginLeft: "20px",
                  bgcolor: "background.paper",
                  "&:hover": {
                    bgcolor: "grey.300",
                  },
                }}
              >
                {editEmail ? (
                  <Edit onClick={() => setEditEmail(false)} />
                ) : (
                  <Done
                    onClick={() => {
                      console.log("Email Updated");
                      setEditEmail(true);
                    }}
                  />
                )}
              </IconButton>{" "}
            </div>

            <Button variant="contained" onClick={handleAddClick}>
              Reset Password
            </Button>
            <Button variant="outlined" onClick={handleCancelClick}>
              Cancel
            </Button>
          </>
        ) : (
          <Button variant="outlined" onClick={handleEditClick}>
            Edit Profile
          </Button>
        )}
      </Stack>
      <PasswordDialog open={open} setOpen={setOpen} />
    </Box>
  );
};

export default UserProfile;
