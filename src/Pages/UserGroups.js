import {
  Avatar,
  AvatarGroup,
  InputAdornment,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { DeleteOutline, Done, Search } from "@mui/icons-material";
import GroupsList from "../Components/GroupsList";
import { axiosInstance } from "../AxiosInstance";
import GroupUsers from "../Components/GroupUsers";
import GroupInfo from "../Components/GroupInfo";
import AddUserDialog from "../Components/AddUserDialog";

const UserGroups = () => {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [groupIndex, setGroupIndex] = useState(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [searchText, setSearchText] = useState(""); // Nouvel état pour le texte de recherche

  useEffect(() => {
    getGroups();
  }, []);

  const refresh = (users) => {
    setUsers((prevUsers) => [...prevUsers, ...users]);
  };

  const getGroups = async () => {
    try {
      let accessToken = sessionStorage.getItem("token");
      const response = await axiosInstance.get("/groups/admin", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 200) {
        setGroups(response.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log("You have no sharing lists");
      } else {
        console.log("Internal Server Error");
      }
    }
  };

  const handleGroupClick = (index, users, title, description) => {
    setGroupIndex(index);
    setUsers(users);
    setTitle(title);
    setDescription(description);
    setIsEditingTitle(false);
    setIsEditingDescription(false);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  return (
    <div className="mt-[100px] w-full flex flex-row h-[calc(100vh-100px)] ml-5">
      <GroupsList
        groupIndex={groupIndex}
        setGroupIndex={setGroupIndex}
        groups={groups}
        setGroups={setGroups}
        setUsers={setUsers}
        setTitle={setTitle}
        setDescription={setDescription}
        handleGroupClick={handleGroupClick}
      />
      <div className="rounded-lg w-[70%] flex flex-col pl-5 mr-5">
        {groupIndex !== null && groups[groupIndex] && (
          <GroupInfo
            title={title}
            description={description}
            groupId={groups[groupIndex].id}
            isEditingTitle={isEditingTitle}
            setIsEditingTitle={setIsEditingTitle}
            isEditingDescription={isEditingDescription}
            setIsEditingDescription={setIsEditingDescription}
            setTitle={setTitle}
            setDescription={setDescription}
            groups={groups}
            setGroups={setGroups}
            groupIndex={groupIndex}
          />
        )}
        <div className="usersName flex-1 flex flex-col mt-5 overflow-auto">
          <TextField
            sx={{ width: "60%", marginLeft: "auto", marginRight: "auto" }}
            variant="filled"
            label="search for a user"
            value={searchText}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <div className="w-full bg-blue-50 flex-1 shadow-[5px_5px_15px_rgba(0,0,0,0.3)] rounded-lg mt-2.5 overflow-auto">
            <GroupUsers
              users={users}
              setUsers={setUsers}
              groups={groups}
              setGroups={setGroups}
              groupIndex={groupIndex}
              searchText={searchText}
            />
            {groupIndex != null && (
              <AddUserDialog
                users={users}
                groupId={groups[groupIndex].id}
                groups={groups}
                setGroups={setGroups}
                groupIndex={groupIndex}
                refresh={refresh}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGroups;
