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

// Mappage pour la rotation des mots de passe
const passwordRotationMapping = {
  "3 months": "3",
  "6 months": "6",
  "9 months": "9",
};

const reversePasswordRotationMapping = {
  3: "3 months",
  6: "6 months",
  9: "9 months",
};

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
      setPasswordRotation(reversePasswordRotationMapping[data.pwd_rotation]);
      setMaxLoginAttempts(data.login_attempt);
      setFileExtensions(data.extensions.map((ext) => ext.extension));
      setAllowedDomains(data.domains.map((domain) => domain.domain));
      setAcceptAllExtensions(data.all_extensions);
      setAcceptAllDomains(data.all_domains);
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
      alert("Extension added successfully");
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
      alert("Domain added successfully");
    } else {
      alert("Error");
    }
  } catch (e) {
    alert(e);
  }
}
async function deleteExtension(ext) {
  try {
    let accessToken = sessionStorage.getItem("token");
    const response = await axiosInstance.delete(`settings/extension`, {
      data: { ext: ext },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.status === 200) {
      alert("Extension deleted successfully");
    } else {
      alert("Error");
    }
  } catch (e) {
    alert(e.message);
  }
}

async function deleteDomain(domain) {
  try {
    let accessToken = sessionStorage.getItem("token");
    const response = await axiosInstance.delete(`settings/domain`, {
      data: { domain: domain },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.status === 200) {
      alert("Domain deleted successfully");
    } else {
      alert("Error");
    }
  } catch (e) {
    alert(e.message);
  }
}

async function updateAllDomains() {
  try {
    let accessToken = sessionStorage.getItem("token");
    const response = await axiosInstance.put(
      `settings/all_domains`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.status === 200) {
      alert("All Domains state updated successfully ");
    } else {
      alert("Error");
    }
  } catch (e) {
    alert(e.message);
  }
}

async function updateAllExtensions() {
  try {
    let accessToken = sessionStorage.getItem("token");
    alert(accessToken);
    const response = await axiosInstance.put(
      `settings/all_extensions`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.status === 200) {
      alert("All Extensions state updated successfully ");
    } else {
      alert("Error");
    }
  } catch (e) {
    alert(e.message);
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
  const [acceptAllExtensionsState, setAcceptAllExtensionsState] = useState([]);

  const [allowedDomains, setAllowedDomains] = useState([]);
  const [newDomain, setNewDomain] = useState("");
  const [acceptAllDomains, setAcceptAllDomains] = useState(false);
  const [acceptAllDomainsState, setAcceptAllDomainsState] = useState([]);

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

  useEffect(() => {
    if (acceptAllExtensions) {
      setAcceptAllExtensionsState(fileExtensions);
      setFileExtensions([]);
    } else {
      setFileExtensions(acceptAllExtensionsState);
    }
  }, [acceptAllExtensions]);

  useEffect(() => {
    if (acceptAllDomains) {
      setAcceptAllDomainsState(allowedDomains);
      setAllowedDomains([]);
    } else {
      setAllowedDomains(acceptAllDomainsState);
    }
  }, [acceptAllDomains]);

  const handleAddExtension = async () => {
    if (newExtension && !fileExtensions.includes(newExtension)) {
      await addNewExtension(newExtension);
      setFileExtensions([...fileExtensions, newExtension]);
      setNewExtension("");
    }
  };

  const handleDeleteExtension = (index, extension) => {
    deleteExtension(extension);
    const updatedExtensions = [...fileExtensions];
    updatedExtensions.splice(index, 1);
    setFileExtensions(updatedExtensions);
  };

  const handleAllExtensions = () => {
    updateAllExtensions();
    setAcceptAllExtensions(!acceptAllExtensions);
  };

  const handleAddDomain = async () => {
    if (newDomain && !allowedDomains.includes(newDomain)) {
      await addNewDomain(newDomain);
      setAllowedDomains([...allowedDomains, newDomain]);
      setNewDomain("");
    }
  };

  const handleDeleteDomain = (index, domain) => {
    deleteDomain(domain);
    const updatedDomains = [...allowedDomains];
    updatedDomains.splice(index, 1);
    setAllowedDomains(updatedDomains);
  };

  const handleAllDomains = () => {
    updateAllDomains();
    setAcceptAllDomains(!acceptAllDomains);
  };

  const handleEditRotationClick = () => {
    setIsEditingRotation(!isEditingRotation);
  };

  const handleSaveRotationClick = () => {
    const selectedRotationValue = passwordRotationMapping[passwordRotation];
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

        {/* Extensions de Fichiers */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              File Extensions
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptAllExtensions}
                  onChange={handleAllExtensions}
                />
              }
              label="Accept all file extensions"
            />
            {!acceptAllExtensions && (
              <>
                <Grid container spacing={2}>
                  {fileExtensions.map((ext, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper
                        elevation={2}
                        sx={{
                          p: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography>{ext}</Typography>
                        <IconButton
                          onClick={() => handleDeleteExtension(index, ext)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
                <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                  <TextField
                    label="New Extension"
                    value={newExtension}
                    onChange={(e) => setNewExtension(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    sx={{ flexGrow: 1 }}
                  />
                  <IconButton color="primary" onClick={handleAddExtension}>
                    <AddCircleIcon />
                  </IconButton>
                </Box>
              </>
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
                  onChange={handleAllDomains}
                />
              }
              label="Accept all domains"
            />
            {!acceptAllDomains && (
              <>
                <Grid container spacing={2}>
                  {allowedDomains.map((domain, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper
                        elevation={2}
                        sx={{
                          p: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography>{domain}</Typography>
                        <IconButton
                          onClick={() => handleDeleteDomain(index, domain)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
                <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                  <TextField
                    label="New Domain"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    sx={{ flexGrow: 1 }}
                  />
                  <IconButton color="primary" onClick={handleAddDomain}>
                    <AddCircleIcon />
                  </IconButton>
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SettingsPage;
