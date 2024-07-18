// CustomRow.js (or wherever it's defined)
import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { TableRow, TableCell, Typography } from "@mui/material";

const CustomRow = ({ row, ...restProps }) =>
  row.isDetailOpen ? renderDetailRow(row) : <DataGrid.Row {...restProps} />;

const renderDetailRow = (user) => (
  <TableRow key={`${user.id}-detail`}>
    <TableCell colSpan={7}>
      <div style={{ padding: 16 }}>
        <Typography variant="subtitle1">Password: {user.password}</Typography>
        <Typography variant="subtitle1">
          Date of Birth: {user.dateOfBirth}
        </Typography>
      </div>
    </TableCell>
  </TableRow>
);

export default CustomRow;
