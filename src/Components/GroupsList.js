import React, { useState } from "react";
import {
  Avatar,
  AvatarGroup,
  Box,
  InputAdornment,
  TextField,
  Popover,
  Typography,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import AddGroup from "./AddGroup";
import { DeleteOutline, Search, Settings } from "@mui/icons-material";
import { axiosInstance } from "../AxiosInstance";

async function deleteGroup(group_id) {
  try {
    let accessToken = sessionStorage.getItem("token");

    await axiosInstance.delete(`groups/admin/delete/${group_id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (e) {
    alert(e);
  }
}

const updateTimeResidency = async (groupId, newTime, onSuccess) => {
  try {
    console.log(newTime);

    const accessToken = sessionStorage.getItem("token");
    const response = await axiosInstance.put(
      `/groups/admin/update/time_residency/${groupId}`,
      { time_residency: newTime },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data); // Message indiquant la mise à jour réussie

    // Appeler le callback onSuccess après une mise à jour réussie
    if (onSuccess) onSuccess(response.data);
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour du temps de residence du groupe :",
      error
    );
  }
};

const GroupsList = ({
  groupIndex,
  setGroupIndex,
  groups,
  setUsers,
  setTitle,
  setDescription,
  setGroups,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null); // Pour le Popover
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [duration, setDuration] = useState(""); // Durée définie par l'utilisateur
  const [timeUnit, setTimeUnit] = useState("days"); // Unité de temps (par défaut: jours)

  const handleGroupClick = (groupId, users, title, description) => {
    const originalIndex = groups.findIndex((group) => group.id === groupId);
    setUsers(users);
    setTitle(title);
    setDescription(description);
    setGroupIndex(originalIndex);
  };

  const filteredGroups = groups.filter((group) =>
    group.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleGroupDelete = (e, id) => {
    e.stopPropagation();
    deleteGroup(id);
    const updatedGroups = groups.filter((group) => group.id !== id);
    setGroups(updatedGroups);
    setUsers([]);
    setGroupIndex(null);
  };

  const handleSettingsClick = (event, group) => {
    event.stopPropagation(); // Empêche l'événement de clic d'affecter d'autres éléments
    setAnchorEl(event.currentTarget);
    setSelectedGroup(group);
    setDuration(group.time_residency);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setDuration("");
    setTimeUnit("days");
  };

  const handleSetTimeResidency = () => {
    // Logique pour enregistrer la durée de résidence des fichiers

    console.log(
      `Setting time residency for group ${selectedGroup.id}: ${duration} ${timeUnit}`
    );

    // Convertir la durée en nombre entier
    const timeResidency = parseInt(duration, 10);

    updateTimeResidency(selectedGroup.id, timeResidency, (data) => {
      // Mettre à jour le groupe dans l'état local
      const updatedGroups = groups.map((group) =>
        group.id === selectedGroup.id
          ? { ...group, time_residency: timeResidency }
          : group
      );
      setGroups(updatedGroups);

      // Fermer le Popover après la mise à jour
      handlePopoverClose();
    });
  };

  return (
    <div className="relative rounded-lg w-2/5 border border-black flex flex-col">
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          backgroundColor: "white",
        }}
      >
        <TextField
          sx={{ width: "100%", marginLeft: "auto", marginRight: "auto" }}
          variant="filled"
          label="search for a group"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </div>
      <div className="flex-grow overflow-auto">
        {filteredGroups.length > 0 &&
          filteredGroups.map((group) => (
            <div
              key={group.id}
              className={`mt-5 mx-auto p-5 pt-2.5 rounded-lg w-[95%] shadow-[5px_5px_15px_rgba(0,0,0,0.3)] cursor-pointer ${
                groupIndex === groups.findIndex((g) => g.id === group.id)
                  ? "bg-[#CBD7D9]"
                  : "bg-blue-50"
              }`}
              onClick={() =>
                handleGroupClick(
                  group.id,
                  group.users,
                  group.title,
                  group.description
                )
              }
            >
              <div className="max-w-full flex justify-between items-center">
                <div className="flex-grow max-w-full overflow-hidden">
                  <div className="font-bold">Groupe : {group.title}</div>
                  <div className="mb-2.5">
                    <b>Description :</b> {group.description}
                  </div>
                  <div className="flex justify-start">
                    <AvatarGroup max={8}>
                      {group.users.map((user, index) => (
                        <Avatar
                          key={index}
                          sx={{
                            color: "#ffffff",
                            backgroundColor: "#29508a",
                          }}
                        >
                          {user.first_name[0] + user.last_name[0]}
                        </Avatar>
                      ))}
                    </AvatarGroup>
                  </div>
                </div>
                <div className="flex items-center space-x-2 min-w-[56px] justify-end">
                  <Settings onClick={(e) => handleSettingsClick(e, group)} />
                  <DeleteOutline
                    onClick={(e) => handleGroupDelete(e, group.id)}
                    sx={{
                      cursor: "pointer",
                      color: "inherit",
                      transition: "color 0.3s",
                      "&:hover": {
                        color: "red",
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
      <Box
        sx={{
          position: "sticky",
          bottom: "10px",
          right: "10px",
        }}
      >
        <AddGroup setGroups={setGroups} groups={groups} />
      </Box>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box p={2}>
          <Typography variant="h6">Set File's Time Residency</Typography>
          <TextField
            label="Duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            fullWidth
            margin="normal"
            inputProps={{ min: 1 }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="time-unit-label">Time Unit</InputLabel>
            <Select
              labelId="time-unit-label"
              value={timeUnit}
              onChange={(e) => setTimeUnit(e.target.value)}
            >
              <MenuItem value="days">Days</MenuItem>
              {/* <MenuItem value="weeks">Weeks</MenuItem>
              <MenuItem value="months">Months</MenuItem> */}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSetTimeResidency}
            disabled={!duration}
          >
            Set
          </Button>
        </Box>
      </Popover>
    </div>
  );
};

export default GroupsList;
