import React, { useState } from "react";
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

const SettingsPage = () => {
  const [fileExtensions, setFileExtensions] = useState([
    ".pdf",
    ".docx",
    ".xlsx",
  ]);
  const [newExtension, setNewExtension] = useState("");
  const [isEditingRotation, setIsEditingRotation] = useState(false);
  const [isEditingLoginAttempts, setIsEditingLoginAttempts] = useState(false);
  const [passwordRotation, setPasswordRotation] = useState("3 mois");
  const [maxLoginAttempts, setMaxLoginAttempts] = useState("5");
  const [acceptAllExtensions, setAcceptAllExtensions] = useState(false);

  const [allowedDomains, setAllowedDomains] = useState([
    "@gmail.com",
    "@esi.dz",
  ]);
  const [newDomain, setNewDomain] = useState("");
  const [acceptAllDomains, setAcceptAllDomains] = useState(false);

  const handleAddExtension = () => {
    if (newExtension && !fileExtensions.includes(newExtension)) {
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
    setIsEditingRotation(false);
  };

  const handleEditLoginAttemptsClick = () => {
    setIsEditingLoginAttempts(!isEditingLoginAttempts);
  };

  const handleSaveLoginAttemptsClick = () => {
    setIsEditingLoginAttempts(false);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        {/* Rotation des Passwords */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Typography variant="h6" gutterBottom>
                Rotation des Passwords
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
              label="Temps de rotation"
              value={passwordRotation}
              onChange={(e) => setPasswordRotation(e.target.value)}
              SelectProps={{ native: true }}
              variant="outlined"
              margin="normal"
              disabled={!isEditingRotation}
            >
              <option value="3 mois">3 mois</option>
              <option value="6 mois">6 mois</option>
              <option value="9 mois">9 mois</option>
            </TextField>
          </Paper>
        </Grid>

        {/* Tentatives de Connexion Maximales */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Typography variant="h6" gutterBottom>
                Tentatives de Connexion Maximales
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
              label="Nombre maximal de tentatives"
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
              Types de Fichiers Cryptés
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptAllExtensions}
                  onChange={(e) => setAcceptAllExtensions(e.target.checked)}
                />
              }
              label="Accepter toutes les extensions"
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
                    label="Ajouter une extension"
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
              Domaines Autorisés
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptAllDomains}
                  onChange={(e) => setAcceptAllDomains(e.target.checked)}
                />
              }
              label="Accepter tous les domaines"
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
                    label="Ajouter un domaine"
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
