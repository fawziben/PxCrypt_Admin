import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { FaBell, FaCheck, FaClock, FaTag, FaUser } from "react-icons/fa";
import {
  Box,
  List,
  Badge,
  Button,
  Avatar,
  Tooltip,
  Divider,
  Popover,
  Typography,
  IconButton,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { axiosInstance } from "../AxiosInstance";
import NotificationItem from "./NotificationItem";

async function getNotifications(setNotifications) {
  try {
    let accessToken = sessionStorage.getItem("token");

    const response = await axiosInstance.get(`/notification/admin`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 200) {
      const sortedNotifications = response.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      ); // Trier par date du plus récent au plus ancien
      setNotifications(sortedNotifications);
    } else {
      console.log("Internal server error");
    }
  } catch (e) {
    console.error(e);
  }
}

async function markNotificationAsRead(id) {
  try {
    let accessToken = sessionStorage.getItem("token");

    const response = await axiosInstance.put(
      `/notification/admin/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.status === 200) {
      console.log("Notification marked as read successfully");
    } else {
      console.log("Internal server error");
    }
  } catch (e) {
    console.error(e);
  }
}

async function markAllNotificationsAsRead() {
  try {
    let accessToken = sessionStorage.getItem("token");

    const response = await axiosInstance.put(
      `/notification/admin/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.status === 200) {
      console.log("Notification marked as read successfully");
    } else {
      console.log("Internal server error");
    }
  } catch (e) {
    console.error(e);
  }
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const totalUnRead = notifications.filter((item) => item.unread).length;

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  };

  const handleMarkAsRead = (id) => {
    markNotificationAsRead(id);
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  useEffect(() => {
    getNotifications(setNotifications);
  }, []);

  return (
    <>
      <IconButton
        color={open ? "primary" : "default"}
        onClick={handleOpen}
        sx={{ width: 40, height: 40 }}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <FaBell color="465475" />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            mt: 1.5,
            ml: 0.75,
            width: 360,
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Vous avez {totalUnRead} messages non lus
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title="Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <FaCheck />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Box
          sx={{
            maxHeight: 400,
            overflowY: "auto",
          }}
        >
          <List
            disablePadding
            subheader={
              <ListSubheader
                disableSticky
                sx={{ py: 1, px: 2.5, typography: "overline" }}
              >
                Nouveau
              </ListSubheader>
            }
          >
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
              />
            ))}
          </List>
        </Box>
      </Popover>
    </>
  );
}
