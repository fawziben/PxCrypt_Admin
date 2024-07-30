import { DeleteOutline } from "@mui/icons-material";
import { Avatar, ListItem, ListItemText } from "@mui/material";
import React from "react";
import { axiosInstance } from "../AxiosInstance";

const GroupUsers = ({
  groupIndex,
  users,
  setUsers,
  groups,
  setGroups,
  searchText,
}) => {
  async function deleteUser(id) {
    try {
      let accessToken = sessionStorage.getItem("token");

      const response = await axiosInstance.delete(
        `/groups/admin/user_group/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 204) {
        console.log("user deleted successfully");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert("You have no sharing lists");
      } else {
        alert("Internal Server Error 2");
      }
    }
  }

  const handleDelete = (userToDelete) => {
    const updatedUsers = users.filter((user) => user.id !== userToDelete.id);
    setUsers(updatedUsers);
    deleteUser(userToDelete.user_group);

    const updatedGroups = [...groups];
    updatedGroups[groupIndex].users = updatedUsers;

    setGroups(updatedGroups);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.first_name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      {filteredUsers.map((user, index) => (
        <div
          key={index}
          className="mt-5 mx-auto p-5 pt-2.5 bg-blue-50 rounded-lg w-[80%] shadow-[5px_5px_15px_rgba(0,0,0,0.3)]"
        >
          <ListItem>
            <Avatar
              sx={{
                color: "#ffffff",
                backgroundColor: "#29508a",
                marginRight: "20px",
              }}
            >
              {user.first_name[0] + user.last_name[0]}
            </Avatar>
            <ListItemText>
              {user.first_name +
                " " +
                user.last_name +
                " (" +
                user.email +
                " )"}
            </ListItemText>
            <DeleteOutline
              sx={{
                cursor: "pointer",
                color: "inherit",
                transition: "color 0.3s",
                "&:hover": {
                  color: "red",
                },
              }}
              onClick={() => handleDelete(user)}
            ></DeleteOutline>
          </ListItem>
        </div>
      ))}
    </div>
  );
};

export default GroupUsers;
