import React, { useEffect, useState } from "react";
import {
  Avatar,
  Typography,
  IconButton,
  Grid,
  Box,
  Card,
  CardContent,
  Divider,
  LinearProgress,
  TextField,
  Button,
  MenuItem,
  Select,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { axiosInstance } from "../AxiosInstance";
import { teal, grey } from "@mui/material/colors";
import {
  convertSize,
  validateEmail,
  validatePasswordPolicy,
  validatePhoneNumber,
} from "../utils";
import { GridCloseIcon } from "@mui/x-data-grid";

async function getFileStats(setFileCounts, setUsedStorage, id) {
  try {
    let accessToken = sessionStorage.getItem("token");
    const response = await axiosInstance.get(`stats/file-counts/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response && response.data) {
      setFileCounts(response.data);
      console.log(response.data.total_uploaded_size);
      setUsedStorage(response.data.total_uploaded_size);
    }
  } catch (e) {
    alert(e);
  }
}

const UserDetails = ({ user, setUsers, onClose }) => {
  const [fileCounts, setFileCounts] = useState();
  const [usedStorage, setUsedStorage] = useState();
  const [totalStorage, setTotalStorage] = useState(user.storage);
  const [storageUnit, setStorageUnit] = useState("MB"); // Default unit is MB
  const [newStorage, setNewStorage] = useState();

  const [editMode, setEditMode] = useState(false);
  const [editableUser, setEditableUser] = useState({ ...user });

  useEffect(() => {
    getFileStats(setFileCounts, setUsedStorage, user.id);
  }, [user.id]);

  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  const handleEditSave = () => {
    setEditMode(!editMode);
    handleSaveChanges();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      console.log(editableUser);
      if (!validateEmail(editableUser.email)) {
        alert("Incorrect email address");
        return;
      }
      if (!validatePhoneNumber(editableUser.phoneNumber)) {
        alert("Incorrect phone number");
        return;
      }
      if (
        editableUser.password &&
        !validatePasswordPolicy(editableUser.password)
      ) {
        alert(
          "Password must contain at least 12 characters (uppercase, lowercase, digit, and special character)"
        );
        return;
      }
      let accessToken = sessionStorage.getItem("token");
      const response = await axiosInstance.put(
        `admin/update_user/${user.id}`,
        {
          firstName: editableUser.firstName,
          lastName: editableUser.lastName,
          email: editableUser.email,
          phoneNumber: editableUser.phoneNumber,
          time_residency: editableUser.time_residency,
          password: editableUser.password,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        alert("User information updated successfully!");

        // Mettre à jour l'utilisateur modifié dans la liste `users`
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.id === user.id ? { ...u, ...editableUser } : u
          )
        );
        setEditMode(false);
      }
    } catch (e) {
      alert("Error updating user information.");
    }
  };

  const handleViewFiles = (type) => {
    console.log(`Viewing ${type} files for user with ID: ${user.id}`);
  };

  const handleChangeStorageLimit = (e) => {
    const value = Number(e.target.value);
    setNewStorage(value);
  };

  const handleUnitChange = (e) => {
    const newUnit = e.target.value;
    setStorageUnit(newUnit);
  };

  const handleSaveStorageLimit = async (id) => {
    let newLimitInBytes;
    if (storageUnit === "GB") {
      newLimitInBytes = newStorage * 1024 * 1024 * 1024; // Convert GB to bytes
    } else {
      newLimitInBytes = newStorage * 1024 * 1024; // Convert MB to bytes
    }
    if (newLimitInBytes < usedStorage) {
      alert("Le nouveau stockage ne peut être inférieur au stockage utilisé.");
    } else {
      setTotalStorage(newLimitInBytes);
      try {
        let accessToken = sessionStorage.getItem("token");
        await axiosInstance.put(
          `users/admin/update/storage/${id}`,
          {
            storage: newLimitInBytes,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        alert("Storage limit updated successfully!");
      } catch (e) {
        alert("Error updating storage limit.");
      }
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "900px",
        mx: "auto",
        p: 3,
        bgcolor: grey[100],
      }}
    >
      <IconButton
        onClick={onClose}
        style={{ position: "absolute", top: "10px", right: "10px" }}
        aria-label="close"
      >
        <GridCloseIcon />
      </IconButton>
      <Card elevation={3} sx={{ borderRadius: 2, mb: 3, bgcolor: teal[100] }}>
        <CardContent sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src={user.img_src}
            sx={{
              width: 120,
              height: 120,
              border: `3px solid ${teal[700]}`,
              mr: 2,
            }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: teal[800] }}
            >
              {user.firstName + " " + user.lastName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {user.email}
            </Typography>
          </Box>
          <IconButton>
            {editMode ? (
              <SaveIcon onClick={handleEditSave} />
            ) : (
              <EditIcon onClick={handleEditClick} />
            )}
          </IconButton>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 2, p: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Personal Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2">
              First Name:{" "}
              {editMode ? (
                <TextField
                  name="firstName"
                  value={editableUser.firstName}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                />
              ) : (
                <strong>{user.firstName}</strong>
              )}
            </Typography>
            <Typography variant="body2">
              Last Name:{" "}
              {editMode ? (
                <TextField
                  name="lastName"
                  value={editableUser.lastName}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                />
              ) : (
                <strong>{user.lastName}</strong>
              )}
            </Typography>
            <Typography variant="body2">
              Email:{" "}
              {editMode ? (
                <TextField
                  name="email"
                  value={editableUser.email}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                />
              ) : (
                <strong>{user.email}</strong>
              )}
            </Typography>
            <Typography variant="body2">
              Phone:{" "}
              {editMode ? (
                <TextField
                  name="phoneNumber"
                  value={editableUser.phoneNumber}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                />
              ) : (
                <strong>{user.phoneNumber}</strong>
              )}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 2, p: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Account Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2">
              Password:{" "}
              {editMode ? (
                <TextField
                  name="password"
                  value={editableUser.password}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  type="password"
                />
              ) : (
                <strong>************</strong>
              )}
            </Typography>
            <Typography variant="body2">
              Created At: <strong>{user.createdAt}</strong>
            </Typography>
            <Typography variant="body2">
              Last Connection: <strong>{user.lastConnection}</strong>
            </Typography>
            <Typography variant="body2">
              Time Residency:{" "}
              {editMode ? (
                <TextField
                  name="time_residency"
                  value={editableUser.time_residency}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  type="number"
                  inputProps={{ min: 1 }}
                />
              ) : (
                <strong>{user.time_residency + " days"}</strong>
              )}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Card elevation={2} sx={{ borderRadius: 2, mt: 3, p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          File Statistics
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="body2">Uploaded Files</Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body1" fontWeight="bold">
                {fileCounts?.user_files_count}
              </Typography>
              <IconButton
                onClick={() => handleViewFiles("uploaded")}
                size="small"
                sx={{ ml: 1 }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2">Shared Files</Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body1" fontWeight="bold">
                {fileCounts?.shared_files_count}
              </Typography>
              <IconButton
                onClick={() => handleViewFiles("shared")}
                size="small"
                sx={{ ml: 1 }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2">Received Files</Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body1" fontWeight="bold">
                {fileCounts?.received_files_count}
              </Typography>
              <IconButton
                onClick={() => handleViewFiles("received")}
                size="small"
                sx={{ ml: 1 }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Storage Section */}
      <Card elevation={2} sx={{ borderRadius: 2, mt: 3, p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          Storage Usage
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2">
          Used Storage: <strong>{convertSize(usedStorage)}</strong>
        </Typography>
        <Typography variant="body2">
          Total Storage: <strong>{convertSize(totalStorage)}</strong>
        </Typography>
        <LinearProgress
          variant="determinate"
          value={(usedStorage / totalStorage) * 100}
          sx={{ height: 20, borderRadius: 5, my: 2 }}
        />
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <TextField
              type="number"
              label="Change Storage Limit"
              variant="outlined"
              value={newStorage}
              onChange={handleChangeStorageLimit}
              fullWidth
              inputProps={{ min: 50 }}
            />
          </Grid>
          <Grid item xs={4}>
            <Select
              value={storageUnit}
              onChange={handleUnitChange}
              variant="outlined"
              fullWidth
            >
              <MenuItem value="MB">MB</MenuItem>
              <MenuItem value="GB">GB</MenuItem>
            </Select>
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSaveStorageLimit(user.id)}
          sx={{ mt: 2 }}
        >
          Save Changes
        </Button>
      </Card>
    </Box>
  );
};

export default UserDetails;
