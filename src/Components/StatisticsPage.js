import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { teal, grey } from "@mui/material/colors";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { axiosInstance } from "../AxiosInstance";
import { convertSize } from "../utils";

// Static data for file extensions
// const fileExtensionsData = [
//   { extension: ".pdf", count: 20 },
//   { extension: ".docx", count: 15 },
//   { extension: ".xlsx", count: 10 },
//   { extension: ".jpg", count: 25 },
//   { extension: ".png", count: 30 },
// ];

const colors = [teal[500], grey[400]];

const formatStorage = (bytes) => {
  if (bytes >= 1e9) {
    return `${(bytes / 1e9).toFixed(2)} GB`;
  }
  if (bytes >= 1e6) {
    return `${(bytes / 1e6).toFixed(2)} MB`;
  }
  if (bytes >= 1e3) {
    return `${(bytes / 1e3).toFixed(2)} KB`;
  }
  return `${bytes} Bytes`;
};

const StatsPage = () => {
  const [userStorageData, setUserStorageData] = useState([]);
  const [open, setOpen] = useState(false);
  const [serverStats, setServerStats] = useState(null);
  const [fileExtensionsData, setFileExtensionsData] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function getServerStats() {
    try {
      let accessToken = sessionStorage.getItem("token");

      const response = await axiosInstance.get(`stats/server_stats`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        setServerStats(response.data);
      }
    } catch (e) {
      alert(e);
    }
  }

  async function getUsersStorage() {
    try {
      let accessToken = sessionStorage.getItem("token");

      const response = await axiosInstance.get(`stats/user_storage`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        setUserStorageData(response.data);
      }
    } catch (e) {
      alert(e);
    }
  }

  async function getFileExtensions() {
    try {
      let accessToken = sessionStorage.getItem("token");

      const response = await axiosInstance.get(`stats/file_extensions`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200 && response.data) {
        // Vérifiez si response.data est un tableau et contient au moins un élément
        if (Array.isArray(response.data) && response.data.length > 0) {
          setFileExtensionsData(response.data);
        } else {
          // Si data est vide ou ne contient pas d'éléments valides
          setFileExtensionsData([]);
        }
      }
    } catch (e) {
      alert(e);
    }
  }

  // Format data for bar chart (in bytes)
  const formatBarChartData = (data) => {
    return data.map((item) => ({
      ...item,
      storage_used: item.storage_used, // Assume this is in bytes
    }));
  };

  // Format the data for the tooltip
  const formatTooltipValue = (value) => {
    return formatStorage(value);
  };

  const barChartData = formatBarChartData(userStorageData.slice(0, 20));

  const CustomTooltip = ({ payload }) => {
    if (payload && payload.length) {
      const { value } = payload[0];
      return (
        <Box
          sx={{ p: 1, bgcolor: grey[900], color: grey[50], borderRadius: 1 }}
        >
          <Typography>{`Storage Used: ${formatTooltipValue(
            value
          )}`}</Typography>
        </Box>
      );
    }
    return null;
  };

  useEffect(() => {
    getServerStats();
    getUsersStorage();
    getFileExtensions();
  }, []);

  const pieData = serverStats
    ? [
        { name: "Active Users", value: serverStats.active_users },
        { name: "Blocked Users", value: serverStats.blocked_users },
      ]
    : [];
  return (
    <Box sx={{ p: 3, bgcolor: grey[100], minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 3, color: teal[800] }}>
        Server Statistics
      </Typography>

      <Grid container spacing={3} mb={3}>
        {/* Conditionally render the cards only if serverStats is not null */}
        {serverStats && (
          <>
            <Grid item xs={12} md={3}>
              <Card elevation={3} sx={{ borderRadius: 2, bgcolor: teal[50] }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: teal[700] }}>
                    Total Users
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1, color: teal[800] }}>
                    {serverStats.total_users}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card elevation={3} sx={{ borderRadius: 2, bgcolor: teal[50] }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: teal[700] }}>
                    Active Users
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1, color: teal[800] }}>
                    {serverStats.active_users}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card elevation={3} sx={{ borderRadius: 2, bgcolor: teal[50] }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: teal[700] }}>
                    Blocked Users
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1, color: teal[800] }}>
                    {serverStats.blocked_users}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card elevation={3} sx={{ borderRadius: 2, bgcolor: teal[50] }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: teal[700] }}>
                    Total Storage Used
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1, color: teal[800] }}>
                    {convertSize(serverStats.total_storage_used)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ height: 400 }}>
              <Typography variant="h6" sx={{ color: teal[700] }}>
                User Statistics
              </Typography>
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill={teal[600]}
                    dataKey="value"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ height: 400 }}>
              <Typography variant="h6" sx={{ color: teal[700] }}>
                File Extensions Distribution
              </Typography>
              <ResponsiveContainer width="100%" height="80%">
                {fileExtensionsData.length > 0 ? (
                  <BarChart data={fileExtensionsData}>
                    <XAxis dataKey="extension" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill={teal[500]} />
                  </BarChart>
                ) : (
                  <Typography sx={{ mt: 2, color: grey[600] }}>
                    No data available for file extensions.
                  </Typography>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ height: 400 }}>
              <Typography variant="h6" sx={{ color: teal[700] }}>
                User Storage Usage
              </Typography>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={barChartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="storage_used" fill={teal[500]} />
                </BarChart>
              </ResponsiveContainer>
              {userStorageData.length > 20 && (
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClickOpen}
                  >
                    View All Users
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>User Storage Details</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell align="right">Storage Used (GB)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userStorageData.map((user) => (
                  <TableRow key={user.name}>
                    <TableCell component="th" scope="row">
                      {user.name}
                    </TableCell>
                    <TableCell align="right">
                      {formatStorage(user.storage_used)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StatsPage;
