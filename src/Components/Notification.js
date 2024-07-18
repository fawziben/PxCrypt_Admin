import PropTypes from "prop-types";
import { set, sub } from "date-fns";
import { useState } from "react";
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

// Notifications statiques pour les tests
const STATIC_NOTIFICATIONS = [
  {
    _id: "1",
    type: "fichier_recu",
    contenu: "Vous avez recun un nouveau fichier.",
    lien: "/offres/1",
    date_creation: set(new Date(), { hours: 10, minutes: 30 }).toISOString(),
    statut: "non lu",
  },
  {
    _id: "2",
    type: "fichier_recu",
    contenu: "Vous avez recun un nouveau fichier.",
    lien: "/offres/2",
    date_creation: sub(new Date(), { hours: 3, minutes: 30 }).toISOString(),
    statut: "non lu",
  },
  {
    _id: "3",
    type: "candidature_refusee",
    contenu: "Candidature refusée.",
    lien: "/offres/2",
    date_creation: sub(new Date(), { hours: 3, minutes: 30 }).toISOString(),
    statut: "non lu",
  },
  {
    _id: "4",
    type: "candidature_refusee",
    contenu: "Candidature refusée.",
    lien: "/offres/2",
    date_creation: sub(new Date(), { hours: 3, minutes: 30 }).toISOString(),
    statut: "non lu",
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(STATIC_NOTIFICATIONS);
  const totalUnRead = notifications.filter(
    (item) => item.statut === "non lu"
  ).length;

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        statut: "lu",
      }))
    );
  };

  const handleMarkAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification._id === id
          ? { ...notification, statut: "lu" }
          : notification
      )
    );
  };

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
          {notifications.slice(0, 2).map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
            />
          ))}
        </List>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple>
            Voir tout
          </Button>
        </Box>
      </Popover>
    </>
  );
}

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    _id: PropTypes.string,
    type: PropTypes.string,
    contenu: PropTypes.string,
    date_creation: PropTypes.string,
    statut: PropTypes.string,
    lien: PropTypes.string,
  }),
  onMarkAsRead: PropTypes.func,
};

function NotificationItem({ notification, onMarkAsRead }) {
  const { avatar, title } = renderContent(notification);

  const handleNotificationClick = () => {
    onMarkAsRead(notification._id);
    window.location.href = notification.lien;
  };

  return (
    <ListItemButton
      onClick={handleNotificationClick}
      sx={{
        py: 1.5,
        px: 2.5,
        mt: "1px",
        ...(notification.statut === "non lu" && {
          bgcolor: "action.selected",
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: "background.neutral" }}>{avatar}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: "flex",
              alignItems: "center",
              color: "text.disabled",
            }}
          >
            <FaClock className="mr-1" />
            {"February 24, 2024"}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

function renderContent(notification) {
  let avatar;
  switch (notification.type) {
    case "nouvelle_offre":
      avatar = <FaTag />;
      break;
    case "candidature_refusee":
      avatar = <FaUser />;
      break;
    default:
      avatar = <FaBell />;
  }
  let title = notification.contenu;
  return { avatar, title };
}
