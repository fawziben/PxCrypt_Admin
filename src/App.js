// App.js
import React from "react";
import LoginPage from "./Components/LoginPage";
import Layout from "./Pages/Layout";
import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import UsersTable from "./Components/UsersTable";
import { CssBaseline } from "@mui/material";
import DataTable from "./Components/UsersCustomTable";
import UserDetails from "./Components/UserDetails";
import "./App.css";
import UserGroups from "./Pages/UserGroups";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { NotificationsPage } from "./Components/NotificationsPage";
import StatisticsPage from "./Components/StatisticsPage";

const customTheme = createTheme({
  palette: {
    primary: {
      main: "#27535E",
    },
  },
  typography: {
    fontFamily: "'Outfit', sans-serif",
  },
});

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<LoginPage></LoginPage>} />
          <Route path="dashboard" element={<Layout />}>
            <Route index element={<UsersTable />} />
            <Route
              path="sharedfiles"
              element={<NotificationsPage></NotificationsPage>}
            />

            <Route path="analytics" element={<UserGroups></UserGroups>} />
            <Route path="groups" element={<StatisticsPage></StatisticsPage>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
