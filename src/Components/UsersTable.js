import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { axiosInstance } from "../AxiosInstance";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import { CheckCircle, ExpandMore } from "@mui/icons-material";
import UserDetails from "./UserDetails"; // Importez le composant UserDetails
import { useTransition, animated } from "react-spring"; // Importez useTransition et animated depuis react-spring

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(4),
  height: theme.spacing(4),
  fontSize: theme.typography.pxToRem(12),
  margin: "auto",
}));

const changeUserState = async (id) => {
  try {
    let accessToken = sessionStorage.getItem("token");
    const response = await axiosInstance.put(
      `users/block/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log(response);

    if (response.status === 200) {
      console.log("user blocked successfully");
    } else {
      console.log("Error while blocking this user");
    }
  } catch (error) {
    console.log("Error:", error);
  }
};

const deleteUser = async (id, setUsers) => {
  try {
    let accessToken = sessionStorage.getItem("token");
    const response = await axiosInstance.delete(`users/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log(response);

    if (response.status === 204) {
      console.log("user Deleted successfully");
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } else {
      console.log("Error while deleting this user");
    }
  } catch (error) {
    console.log("Error:", error);
  }
};

export default function UsersTable() {
  const [containerHeight, setContainerHeight] = useState(0);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // État pour suivre l'utilisateur sélectionné

  const formatDate = (date) => {
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    return formattedDate;
  };

  async function getUsers() {
    try {
      let accessToken = sessionStorage.getItem("token");

      const response = await axiosInstance.get(`users/admin`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response && response.data && response.data.length > 0) {
        console.log(response.data);
        const usersData = response.data.map((user) => ({
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          phoneNumber: user.phone_number,
          img_src: user.img_src,
          createdAt: formatDate(user.created_at),
          status: user.state, // Utilisez le statut réel de l'utilisateur ici
          time_residency: user.time_residency,
          storage: user.storage,
        }));
        setUsers(usersData);
      }
    } catch (e) {
      alert(e);
    }
  }

  useEffect(() => {
    getUsers();
    updateContainerHeight(); // Appeler ici pour s'assurer que la hauteur est mise à jour dès le début
    window.addEventListener("resize", updateContainerHeight);
    return () => {
      window.removeEventListener("resize", updateContainerHeight);
    };
  }, []);

  const updateContainerHeight = () => {
    const windowHeight = window.innerHeight;
    const marginTop = 100; // Ajustez cela selon votre mise en page
    const remainingHeight = windowHeight - marginTop;
    setContainerHeight(remainingHeight);
  };

  const handleDeleteUser = (userId) => {
    // Logique de suppression de l'utilisateur
    console.log(`Deleting user with ID ${userId}`);

    // // Filtrez l'utilisateur supprimé de l'état local
    // setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    deleteUser(userId, setUsers);
  };

  const handleBlockUser = async (userId) => {
    const updatedUsers = [...users];
    const userIndex = updatedUsers.findIndex((user) => user.id === userId);

    if (userIndex !== -1) {
      // Mettre à jour localement l'état de l'utilisateur
      updatedUsers[userIndex].status = false;
      setUsers(updatedUsers);
      changeUserState(userId);
    }
  };

  const handleActivateUser = async (userId) => {
    const updatedUsers = [...users];
    const userIndex = updatedUsers.findIndex((user) => user.id === userId);

    if (userIndex !== -1) {
      // Mettre à jour localement l'état de l'utilisateur
      updatedUsers[userIndex].status = true;
      setUsers(updatedUsers);
      changeUserState(userId);
    }
  };

  const handleExpandDetails = (userId) => {
    setSelectedUser(userId); // Mettre à jour l'utilisateur sélectionné
  };

  const handleCloseDetails = () => {
    setSelectedUser(null); // Réinitialiser l'utilisateur sélectionné
  };

  const transitions = useTransition(selectedUser, {
    from: { transform: "translateX(-100%)", opacity: 0 },
    enter: { transform: "translateX(0%)", opacity: 1 },
    leave: { transform: "translateX(-100%)", opacity: 0 },
  });

  const columns = [
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      cellClassName: "status-cell",
      renderCell: (params) => (
        <SmallAvatar sx={{ bgcolor: params.value ? "green" : "red" }}>
          {params.value ? "A" : "B"}
        </SmallAvatar>
      ),
    },
    { field: "firstName", headerName: "First Name", flex: 1 },
    { field: "lastName", headerName: "Last Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phoneNumber", headerName: "Phone Number", flex: 1 },
    { field: "createdAt", headerName: "Created At", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      cellClassName: "actions-cell",
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <Tooltip title="Delete">
            <IconButton
              onClick={() => handleDeleteUser(params.row.id)}
              style={{ color: "#FF5722" }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={params.row.status ? "Block" : "Activate"}>
            <IconButton
              onClick={() =>
                params.row.status
                  ? handleBlockUser(params.row.id)
                  : handleActivateUser(params.row.id)
              }
              style={{
                color: params.row.status ? "#FF9800" : "#4CAF50",
              }}
            >
              {params.row.status ? <BlockIcon /> : <CheckCircle />}
            </IconButton>
          </Tooltip>
          <Tooltip title="More Details">
            <IconButton onClick={() => handleExpandDetails(params.row.id)}>
              <ExpandMore />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div
      className="w-full h-full overflow-y-auto"
      style={{ marginTop: "100px" }}
    >
      <div
        style={{
          height: `${containerHeight}px`,
          width: "100%",
          position: "relative",
        }}
      >
        <DataGrid
          rows={users}
          columns={columns}
          pageSizeOptions={[5, 10]}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#25525D",
              color: "white",
              fontWeight: "bold", // Texte en gras
              fontSize: "16px", // Taille de police augmentée
            },
            "& .MuiDataGrid-cell": {
              backgroundColor: "#fff",
              fontSize: "16px", // Taille de police augmentée pour les lignes
            },
            "& .MuiDataGrid-row": {
              marginBottom: "4px", // Ajoutez un espace entre les lignes
              borderBottom: "none", // Supprimez la bordure par défaut
            },
            "& .status-cell": {
              display: "flex",
              justifyContent: "center",
            },
            "& .actions-cell": {
              display: "flex",
              justifyContent: "center",
            },
          }}
        />
        {transitions((style, item) =>
          item ? (
            <animated.div
              style={{
                ...style,
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "#EFF3F3",
                zIndex: 2,
              }}
            >
              <UserDetails
                user={users.find((user) => user.id === item)}
                setUsers={setUsers}
                onClose={handleCloseDetails}
              />
            </animated.div>
          ) : null
        )}
      </div>
    </div>
  );
}
