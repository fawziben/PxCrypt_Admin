import React, { useState } from "react";
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

// Static data for testing
const statsData = {
  activeUsers: 150,
  blockedUsers: 20,
  totalUsers: 170,
  totalStorageUsed: 500, // in GB
};

// Static data for user storage
const userStorageData = Array.from({ length: 25 }, (_, i) => ({
  name: `User ${i + 1}`,
  storageUsed: Math.floor(Math.random() * 50) + 1, // Random storage usage between 1 and 50 GB
}));

// Static data for file extensions
const fileExtensionsData = [
  { extension: ".pdf", count: 20 },
  { extension: ".docx", count: 15 },
  { extension: ".xlsx", count: 10 },
  { extension: ".jpg", count: 25 },
  { extension: ".png", count: 30 },
  // Add more file extensions as needed
];

const pieData = [
  { name: "Active Users", value: statsData.activeUsers },
  { name: "Blocked Users", value: statsData.blockedUsers },
];

const colors = [teal[500], grey[400]];

const StatsPage = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Limit the data displayed in the BarChart
  const barChartData = userStorageData.slice(0, 20);

  // Define a fixed height for the charts
  const cardContentHeight = 400; // You can adjust this height as needed

  return (
    <Box sx={{ p: 3, bgcolor: grey[100], minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 3, color: teal[800] }}>
        Server Statistics
      </Typography>
      <Grid container spacing={3} mb={3}>
        {/* Cards for statistics */}
        <Grid item xs={12} md={3}>
          <Card elevation={3} sx={{ borderRadius: 2, bgcolor: teal[50] }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: teal[700] }}>
                Total Users
              </Typography>
              <Typography variant="h4" sx={{ mt: 1, color: teal[800] }}>
                {statsData.totalUsers}
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
                {statsData.activeUsers}
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
                {statsData.blockedUsers}
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
                {statsData.totalStorageUsed} GB
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ height: cardContentHeight }}>
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
                      <Cell key={`cell-${index}`} fill={colors[index % 2]} />
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
            <CardContent sx={{ height: cardContentHeight }}>
              <Typography variant="h6" sx={{ color: teal[700] }}>
                File Extensions Distribution
              </Typography>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={fileExtensionsData}>
                  <XAxis dataKey="extension" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill={teal[500]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ height: cardContentHeight }}>
              <Typography variant="h6" sx={{ color: teal[700] }}>
                User Storage Usage
              </Typography>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={barChartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="storageUsed" fill={teal[500]} />
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
                    <TableCell align="right">{user.storageUsed}</TableCell>
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
