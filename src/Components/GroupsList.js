import React, { useState } from "react";
import {
  Avatar,
  AvatarGroup,
  Box,
  InputAdornment,
  TextField,
} from "@mui/material";
import AddGroup from "./AddGroup";
import { DeleteOutline, Search } from "@mui/icons-material";
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
              <div className="max-w-full break-words flex">
                <div className="grow">
                  <div className="font-bold">Groupe : {group.title}</div>
                  <div className="mb-2.5">
                    <b>Description :</b> {group.description}
                  </div>
                  <div className="flex justify-start">
                    <AvatarGroup max={10}>
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
                <div>
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
                  ></DeleteOutline>
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
    </div>
  );
};

export default GroupsList;
