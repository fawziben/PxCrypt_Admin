import React, { useState, useEffect } from "react";
import {
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Switch,
  Box,
  Typography,
  AvatarGroup,
  DialogContent,
} from "@mui/material";
import { Search, Download, Message } from "@mui/icons-material";
import { axiosInstance } from "../AxiosInstance";

const AddUserList = ({ recipients, setRecipients, users }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState([]);

  const handleRecipientToggle = (index) => {
    setRecipients((prevState) => {
      const updatedRecipients = prevState.map((recipient) => {
        if (recipient.id === index) {
          if (!recipient.state) {
            setSelectedRecipients((prevSelected) => [
              ...prevSelected,
              recipient,
            ]);
          } else {
            setSelectedRecipients((prevSelected) =>
              prevSelected.filter((r) => r.id !== index)
            );
          }
          return { ...recipient, state: !recipient.state };
        } else {
          return recipient;
        }
      });
      return updatedRecipients;
    });
  };

  const filteredRecipients = recipients.filter((recipient) =>
    recipient.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    try {
      let accessToken = sessionStorage.getItem("token");

      const response = await axiosInstance.get(`users/admin`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response && response.data && response.data.length > 0) {
        const usersData = response.data;

        // Filtrer les utilisateurs en excluant ceux dont l'ID existe déjà dans `users`
        const newRecipients = usersData
          .filter((user) => !users.some((u) => u.id === user.id))
          .map((user) => ({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            fullname: `${user.first_name} ${user.last_name}`,
            email: user.email,
            state: false,
            avatar: `${user.last_name[0].toUpperCase()}${user.first_name[0].toUpperCase()}`,
          }));

        setRecipients(newRecipients);
      }
    } catch (e) {
      alert(e);
    }
  }

  return (
    <div>
      <DialogContent
        sx={{ width: "500px", maxHeight: "300px", overflow: "hidden" }}
      >
        <TextField
          label="User Name"
          variant="filled"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ marginBottom: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <List sx={{ height: 205, overflow: "auto" }}>
          {filteredRecipients.map((recipient) => (
            <div key={recipient.id}>
              <ListItem>
                <Avatar
                  sx={{
                    color: "#ffffff",
                    backgroundColor: "#29508a",
                    marginRight: "20px",
                  }}
                >
                  {recipient.avatar}
                </Avatar>
                <ListItemText primary={recipient.fullname} />
                <Switch
                  checked={recipient.state}
                  onChange={() => handleRecipientToggle(recipient.id)}
                />
              </ListItem>
            </div>
          ))}
        </List>
      </DialogContent>
      {selectedRecipients.length > 0 && (
        <div
          style={{
            width: "450px",
            marginTop: "20px",
            marginRight: "auto",
            padding: "20px",
            paddingTop: "10px",
            marginLeft: "auto",
            backgroundColor: "#CBD7D9",
            borderRadius: "10px",
          }}
        >
          <div style={{ marginBottom: "10px" }}>
            Liste des utilisateur sélectionnés :
          </div>
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <AvatarGroup max={10}>
              {selectedRecipients.map((recipient) => (
                <Avatar
                  key={recipient.id}
                  sx={{ color: "#ffffff", backgroundColor: "#29508a" }}
                >
                  {recipient.avatar}
                </Avatar>
              ))}
            </AvatarGroup>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddUserList;
