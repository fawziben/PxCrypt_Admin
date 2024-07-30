import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { axiosInstance } from "../AxiosInstance";

export default function AddGroupDialog({ open, setOpen, setGroups, groups }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleCreateGroup = () => {
    createNewGroup(title, description);
    handleCloseDialog();
  };
  const createNewGroup = async (title, description) => {
    try {
      const accessToken = sessionStorage.getItem("token");
      const response = await axiosInstance.post(
        `/groups/admin/create`,
        { title: title, description: description },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // Create a new group object
        const newGroup = {
          id: response.data.id,
          title: title,
          description: description,
          users: [],
        };
        // Append the new group to the existing groups array
        const updatedGroups = [...groups, newGroup];
        setGroups(updatedGroups);
        console.log(newGroup);
        console.log(groups[10].title);
        setGroups((prevGroups) => [...prevGroups]);
      } else {
        console.log("Internal server error");
      }
    } catch (error) {
      console.error("Erreur lors de la création du groupe :", error);
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={handleCloseDialog}>
        <div className="w-[400px]">
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Add a new group
          </DialogTitle>
          <DialogContent>
            <TextField
              sx={{ width: "100%" }}
              label="Group Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              minRows={3}
            />
            <br />
            <br />
            <TextField
              sx={{ width: "100%" }}
              label="Group Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCreateGroup} variant="contained">
              Create
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </div>
  );
}
