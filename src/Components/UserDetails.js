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
import { axiosInstance } from "../AxiosInstance";
import { teal, grey } from "@mui/material/colors";
import { convertSize } from "../utils";

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

const UserDetails = ({ user }) => {
  const [fileCounts, setFileCounts] = useState();
  const [usedStorage, setUsedStorage] = useState();
  const [totalStorage, setTotalStorage] = useState(user.storage);
  const [storageUnit, setStorageUnit] = useState("MB"); // Default unit is MB
  const [newStorage, setNewStorage] = useState();

  useEffect(() => {
    getFileStats(setFileCounts, setUsedStorage, user.id);
  }, [user.id]);

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
      alert(
        "Le nouveau stockage ne peut etre inferieur au stockage utilise stockage "
      );
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
          <Box>
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
              First Name: <strong>{user.firstName}</strong>
            </Typography>
            <Typography variant="body2">
              Last Name: <strong>{user.lastName}</strong>
            </Typography>
            <Typography variant="body2">
              Email: <strong>{user.email}</strong>
            </Typography>
            <Typography variant="body2">
              Phone: <strong>{user.phoneNumber}</strong>
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
              Password: <strong>************</strong>
            </Typography>
            <Typography variant="body2">
              Created At: <strong>{user.createdAt}</strong>
            </Typography>
            <Typography variant="body2">
              Last Connection: <strong>{user.lastConnection}</strong>
            </Typography>
            <Typography variant="body2">
              Time Residency: <strong>{user.time_residency + " days"}</strong>
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
