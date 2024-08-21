import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  Paper,
  IconButton,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { axiosInstance } from "../AxiosInstance";

async function getSettings(
  setPasswordRotation,
  setMaxLoginAttempts,
  setFileExtensions,
  setAllowedDomains,
  setAcceptAllExtensions,
  setAcceptAllDomains
) {
  try {
    let accessToken = sessionStorage.getItem("token");
    const response = await axiosInstance.get("/settings/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.status === 200) {
      const data = response.data;
      setPasswordRotation(data.pwd_rotation);
      setMaxLoginAttempts(data.login_attempt);
      setFileExtensions(data.extensions.map((ext) => ext.extension));
      setAllowedDomains(data.domains.map((domain) => domain.domain));
      setAcceptAllExtensions(data.extensions.length === 0);
      setAcceptAllDomains(data.domains.length === 0);
      alert("Settings retrieved successfully");
    } else {
      alert("Error: " + response.statusText);
    }
  } catch (e) {
    console.error(e);
    alert("Error: " + e.message);
  }
}

async function editPWDRotation(time) {
  try {
    let accessToken = sessionStorage.getItem("token");
    const response = await axiosInstance.put(
      `settings/pwd_rotation`,
      { value: time },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.status === 200) {
      alert("Updated successfully");
    } else {
      alert("Error");
    }
  } catch (e) {
    alert(e);
  }
}

async function editLoginAttempts(time) {
  try {
    let accessToken = sessionStorage.getItem("token");
    const response = await axiosInstance.put(
      `settings/login_attempts`,
      { value: time },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.status === 200) {
      alert("Updated successfully");
    } else {
      alert("Error");
    }
  } catch (e) {
    alert(e);
  }
}

async function addNewExtension(extension) {
  try {
    let accessToken = sessionStorage.getItem("token");
    const response = await axiosInstance.post(
      `settings/extension`,
      { ext: extension },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.status === 200) {
      alert("Updated successfully");
    } else {
      alert("Error");
    }
  } catch (e) {
    alert(e);
  }
}

async function addNewDomain(domain) {
  try {
    let accessToken = sessionStorage.getItem("token");
    const response = await axiosInstance.post(
      `settings/domain`,
      { domain: domain },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.status === 200) {
      alert("Updated successfully");
    } else {
      alert("Error");
    }
  } catch (e) {
    alert(e);
  }
}

const SettingsPage = () => {
  const [fileExtensions, setFileExtensions] = useState([]);
  const [newExtension, setNewExtension] = useState("");
  const [isEditingRotation, setIsEditingRotation] = useState(false);
  const [isEditingLoginAttempts, setIsEditingLoginAttempts] = useState(false);
  const [passwordRotation, setPasswordRotation] = useState("3 months");
  const [maxLoginAttempts, setMaxLoginAttempts] = useState("5");
  const [acceptAllExtensions, setAcceptAllExtensions] = useState(false);

  const [allowedDomains, setAllowedDomains] = useState([]);
  const [newDomain, setNewDomain] = useState("");
  const [acceptAllDomains, setAcceptAllDomains] = useState(false);

  useEffect(() => {
    getSettings(
      setPasswordRotation,
      setMaxLoginAttempts,
      setFileExtensions,
      setAllowedDomains,
      setAcceptAllExtensions,
      setAcceptAllDomains
    );
  }, []);

  const handleAddExtension = () => {
    if (newExtension && !fileExtensions.includes(newExtension)) {
      addNewExtension(newExtension);
      setFileExtensions([...fileExtensions, newExtension]);
      setNewExtension("");
    }
  };

  const handleDeleteExtension = (index) => {
    const updatedExtensions = [...fileExtensions];
    updatedExtensions.splice(index, 1);
    setFileExtensions(updatedExtensions);
  };

  const handleAddDomain = () => {
    if (newDomain && !allowedDomains.includes(newDomain)) {
      addNewDomain(newDomain);
      setAllowedDomains([...allowedDomains, newDomain]);
      setNewDomain("");
    }
  };

  const handleDeleteDomain = (index) => {
    const updatedDomains = [...allowedDomains];
    updatedDomains.splice(index, 1);
    setAllowedDomains(updatedDomains);
  };

  const handleEditRotationClick = () => {
    setIsEditingRotation(!isEditingRotation);
  };

  const handleSaveRotationClick = () => {
    const selectedRotationValue = passwordRotation.split(" ")[0];
    editPWDRotation(selectedRotationValue);
    setIsEditingRotation(false);
  };

  const handleEditLoginAttemptsClick = () => {
    setIsEditingLoginAttempts(!isEditingLoginAttempts);
  };

  const handleSaveLoginAttemptsClick = () => {
    const valueToSend = maxLoginAttempts === "none" ? null : maxLoginAttempts;
    editLoginAttempts(valueToSend);
    setIsEditingLoginAttempts(false);
  };

  return (
    <Box sx={{ p: 4, width: "100%" }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        {/* Rotation des Passwords */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Typography variant="h6" gutterBottom>
                Passwords Rotation
              </Typography>
              <IconButton
                onClick={
                  isEditingRotation
                    ? handleSaveRotationClick
                    : handleEditRotationClick
                }
              >
                {isEditingRotation ? <SaveIcon /> : <EditIcon />}
              </IconButton>
            </Grid>
            <TextField
              fullWidth
              select
              label="Rotation time"
              value={passwordRotation}
              onChange={(e) => setPasswordRotation(e.target.value)}
              SelectProps={{ native: true }}
              variant="outlined"
              margin="normal"
              disabled={!isEditingRotation}
            >
              <option value="3 months">3 months</option>
              <option value="6 months">6 months</option>
              <option value="9 months">9 months</option>
            </TextField>
          </Paper>
        </Grid>

        {/* Tentatives de Connexion Maximales */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Typography variant="h6" gutterBottom>
                Login Attempts
              </Typography>
              <IconButton
                onClick={
                  isEditingLoginAttempts
                    ? handleSaveLoginAttemptsClick
                    : handleEditLoginAttemptsClick
                }
              >
                {isEditingLoginAttempts ? <SaveIcon /> : <EditIcon />}
              </IconButton>
            </Grid>
            <TextField
              fullWidth
              select
              label="Maximum number of attempts"
              value={maxLoginAttempts}
              onChange={(e) => setMaxLoginAttempts(e.target.value)}
              SelectProps={{ native: true }}
              variant="outlined"
              margin="normal"
              disabled={!isEditingLoginAttempts}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="none">None</option>
            </TextField>
          </Paper>
        </Grid>

        {/* Types de Fichiers Cryptés */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Encrypted File Types
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptAllExtensions}
                  onChange={(e) => setAcceptAllExtensions(e.target.checked)}
                />
              }
              label="Accept all extensions"
            />
            {!acceptAllExtensions && (
              <Grid container spacing={1} alignItems="center">
                {fileExtensions.map((ext, index) => (
                  <React.Fragment key={index}>
                    <Grid item xs={8}>
                      <TextField
                        fullWidth
                        value={ext}
                        disabled
                        variant="outlined"
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteExtension(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </React.Fragment>
                ))}
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    label="Add an extension"
                    value={newExtension}
                    onChange={(e) => setNewExtension(e.target.value)}
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={4}>
                  <IconButton color="primary" onClick={handleAddExtension}>
                    <AddCircleIcon />
                  </IconButton>
                </Grid>
              </Grid>
            )}
          </Paper>
        </Grid>

        {/* Domaines Autorisés */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Allowed Domains
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptAllDomains}
                  onChange={(e) => setAcceptAllDomains(e.target.checked)}
                />
              }
              label="Accept all domains"
            />
            {!acceptAllDomains && (
              <Grid container spacing={1} alignItems="center">
                {allowedDomains.map((domain, index) => (
                  <React.Fragment key={index}>
                    <Grid item xs={8}>
                      <TextField
                        fullWidth
                        value={domain}
                        disabled
                        variant="outlined"
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteDomain(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </React.Fragment>
                ))}
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    label="Add a domain"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={4}>
                  <IconButton color="primary" onClick={handleAddDomain}>
                    <AddCircleIcon />
                  </IconButton>
                </Grid>
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SettingsPage;
