import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Done } from "@mui/icons-material";
import { axiosInstance } from "../AxiosInstance";
import EditIcon from "@mui/icons-material/Edit";

const updateTitle = async (groupId, newTitle) => {
  try {
    const accessToken = sessionStorage.getItem("token");
    const response = await axiosInstance.put(
      `/groups/admin/update/title/${groupId}`,
      { title: newTitle },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json", // Assurez-vous d'ajouter cet en-tête
        },
      }
    );

    console.log(response.data); // Message indiquant la mise à jour réussie
  } catch (error) {
    console.error("Erreur lors de la mise à jour du titre du groupe :", error);
  }
};

const updateDescription = async (groupId, newDescription) => {
  try {
    const accessToken = sessionStorage.getItem("token");
    const response = await axiosInstance.put(
      `/groups/admin/update/description/${groupId}`,
      { description: newDescription },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json", // Assurez-vous d'ajouter cet en-tête
        },
      }
    );

    console.log(response.data); // Message indiquant la mise à jour réussie
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour de la description du groupe :",
      error
    );
  }
};
export default function GroupInfo({
  title,
  description,
  groupId,
  isEditingTitle,
  setIsEditingTitle,
  isEditingDescription,
  setIsEditingDescription,
  setTitle,
  setDescription,
  groups,
  setGroups,
  groupIndex,
}) {
  const handleEditClick = (field) => {
    if (field === "title") {
      setIsEditingTitle(true);
    } else if (field === "description") {
      setIsEditingDescription(true);
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleTitleSubmit = () => {
    updateTitle(groupId, title);
    const updatedGroups = [...groups];
    updatedGroups[groupIndex].title = title;

    setGroups(updatedGroups);
    setTitle(title);
    setIsEditingTitle(false);
    // Mettez à jour le titre sur le serveur ici
    console.log(`Title updated to ${title}`);
  };

  const handleDescriptionSubmit = () => {
    updateDescription(groupId, description);
    const updatedGroups = [...groups];
    updatedGroups[groupIndex].description = description;
    setGroups(updatedGroups);
    setIsEditingDescription(false);
    // Mettez à jour la description sur le serveur ici
    console.log(`Description updated to ${description}`);
  };

  return (
    <div className="w-full flex">
      <div className="h-[100px] rounded-md mr-5 bg-blue-50 shadow-[5px_5px_15px_rgba(0,0,0,0.3)] p-5 pt-2.5 w-[40%] flex ">
        <div className="grow">
          <span>
            <b>Title : </b>
          </span>
          {isEditingTitle ? (
            <TextField
              value={title}
              onChange={handleTitleChange}
              autoFocus
              variant="standard"
            />
          ) : (
            <span>{title}</span>
          )}
        </div>
        {isEditingTitle ? (
          <Done
            sx={{
              cursor: "pointer",
              transition: "color 0.3s",
              "&:hover": {
                color: "green",
              },
            }}
            onClick={handleTitleSubmit}
          />
        ) : (
          <EditIcon
            sx={{ cursor: "pointer" }}
            onClick={() => handleEditClick("title")}
          />
        )}
      </div>
      <div className="h-[100px] rounded-md mr-2.5 bg-blue-50 shadow-[5px_5px_15px_rgba(0,0,0,0.3)] p-5 pt-2.5 w-[60%] overflow-auto flex">
        <div className="grow">
          <span>
            <b>Description : </b>
          </span>
          {isEditingDescription ? (
            <TextField
              value={description}
              onChange={handleDescriptionChange}
              autoFocus
              variant="standard"
            />
          ) : (
            <span>{description}</span>
          )}
        </div>
        {isEditingDescription ? (
          <Done
            sx={{
              cursor: "pointer",
              transition: "color 0.3s",
              "&:hover": {
                color: "green",
              },
            }}
            onClick={handleDescriptionSubmit}
          />
        ) : (
          <EditIcon
            sx={{ cursor: "pointer" }}
            onClick={() => handleEditClick("description")}
          />
        )}
      </div>
    </div>
  );
}
