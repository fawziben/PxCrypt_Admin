// LoginPage.js
import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
} from "@mui/material";
import { styled } from "@mui/system";
import { blue } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../AxiosInstance";
import { Close, ClosedCaption } from "@mui/icons-material";
import OTPFile from "./OTPFile";

const classes = {
  arrowButton: {
    color: "#000000",
    display: "flex",
    height: 30,
    width: 30,
  },
  logo: {
    fontWeight: "bold",
    fontFamily: "Outfit, sans-serif,",
  },
};

const LoginContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  backgroundColor: "#CBD7D9",
});

const Form = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "2rem",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  backgroundColor: blue[50],
});

const StyledButton = styled(Button)({
  marginTop: "1.5rem",
  backgroundColor: "#1976d2",
  "&:hover": {
    backgroundColor: "#115293",
  },
});

const LoginPage = () => {
  const [username, setUsername] = useState(""); // État pour stocker l'email
  const [password, setPassword] = useState(""); // État pour stocker le mot de passe
  const [otp, setOtp] = useState(false);

  const navigate = useNavigate(); // Initialisation du hook de navigation

  const handleClose = () => {
    setOtp(false); // Fermeture de la boîte de dialogue
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/admin/email", {
        username,
        password,
      });

      console.log(response);

      if (response.status === 200) {
        setOtp(true);
        // sessionStorage.setItem("token", response.data.access_token); // Assurez-vous que le token est stocké
        // navigate("dashboard");
      } else {
        console.log("Invalid credentials");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <LoginContainer maxWidth="100%">
      <div style={{ width: "30%" }}>
        <Form component="form" onSubmit={handleLogin}>
          {/* <Typography variant="h4" component="h1" gutterBottom>
            Log-in
          </Typography> */}
          <Box sx={{ display: "flex", flexGrow: 1 }}>
            <Typography variant="h4" sx={{ color: "#666666", ...classes.logo }}>
              Px
            </Typography>
            <Typography variant="h4" sx={{ color: "#26525D", ...classes.logo }}>
              Crypt Admin
            </Typography>
          </Box>
          <TextField
            label="Adresse e-mail"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            autoFocus
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Mot de passe"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <StyledButton
            type="submit"
            variant="contained"
            sx={{ backgroundColor: "#26525D" }}
            fullWidth
          >
            Se connecter
          </StyledButton>
        </Form>
      </div>
      <Dialog open={otp} onClose={handleClose}>
        <DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={classes.closeButton}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <OTPFile email={username} />
        </DialogContent>
      </Dialog>
    </LoginContainer>
  );
};

export default LoginPage;
