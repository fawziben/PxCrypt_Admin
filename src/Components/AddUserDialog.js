import React, { useState } from "react";
import { PersonAddAlt, ShareOutlined, ShareRounded } from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
} from "@mui/material";
import { axiosInstance } from "../AxiosInstance";
import AddUserList from "./AddUserList";

const AddUserDialog = ({
  users,
  groupId,
  groups,
  setGroups,
  groupIndex,
  refresh,
}) => {
  const addUsers = async (id, selectedUsers, rec) => {
    try {
      const accessToken = sessionStorage.getItem("token");
      const response = await axiosInstance.post(
        `/groups/admin/usersadd/${id}`,
        selectedUsers,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("ajoute avec succes");

        const updatedUsers = rec.map((user) => {
          const newUser = response.data.find(
            (newUser) => newUser.id_user === user.id
          );

          if (newUser) {
            return {
              ...user,
              user_group: newUser.id,
            };
          } else {
            return user;
          }
        });

        refresh(updatedUsers);
        const updatedGroups = [...groups];

        updatedGroups[groupIndex].users = [
          ...groups[groupIndex].users,
          ...updatedUsers,
        ];
        setGroups(updatedGroups);

        return updatedUsers;
      } else {
        console.log("Internal server error");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout des membres :", error);
    }
  };

  const [recipients, setRecipients] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const handleShareClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const Add = () => {
    const rec = recipients
      .filter((recipient) => recipient.state)
      .map((recipient) => {
        return {
          id: recipient.id,
          first_name: recipient.first_name,
          last_name: recipient.last_name,
          email: recipient.email,
        };
      });
    const selectedRecipients = recipients
      .filter((recipient) => recipient.state) // Filtrer les destinataires avec `state` à `true`
      .map((recipient) => recipient.id);
    addUsers(groupId, selectedRecipients, rec);
    setOpenDialog(false);
  };

  return (
    <div>
      <Box
        sx={{
          position: "absolute",
          bottom: "10px",
          right: "22px",
          cursor: "pointer",
        }}
        onClick={handleShareClick}
      >
        <Fab color="primary" aria-label="add">
          <PersonAddAlt />
        </Fab>
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md">
        <div>
          {/* Partager le fichier */}
          {/* <ShareRounded style={{ marginLeft: "15px" }}></ShareRounded> */}
        </div>
        <AddUserList
          users={users}
          recipients={recipients}
          setRecipients={setRecipients}
        ></AddUserList>
        <DialogActions>
          <Button variant="contained" onClick={Add}>
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddUserDialog;
