import React, { useState } from "react";
import AddGroupDialog from "./AddGroupDialog";
import { Box, Fab } from "@mui/material";
import { AddOutlined } from "@mui/icons-material";

const AddGroup = ({ setGroups, groups }) => {
  const [open, setOpen] = useState(false);
  const handleAddClick = () => {
    setOpen(true);
  };

  return (
    <Box sx={{ position: "absolute", bottom: "10px", right: "10px" }}>
      <Fab color="primary" aria-label="add" onClick={handleAddClick}>
        <AddOutlined />
      </Fab>
      <AddGroupDialog
        open={open}
        setOpen={setOpen}
        setGroups={setGroups}
        groups={groups}
      />
    </Box>
  );
};

export default AddGroup;
