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

function App() {
  return (
    <div className="App">
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<LoginPage></LoginPage>} />
          <Route path="dashboard" element={<Layout />}>
            <Route index element={<UsersTable />} />
            <Route path="sharedfiles" element={<DataTable></DataTable>} />

            <Route path="analytics" element={<UserGroups></UserGroups>} />
            <Route path="groups" element={<LoginPage></LoginPage>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
