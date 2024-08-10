import React, { useState } from "react";
import MaterialTable from "@material-table/core";
import { useNavigate } from "react-router-dom";
import { MdDone } from "react-icons/md";

export const NotificationsPage = () => {
  const [loading, setLoading] = useState(false);

  const EDITABLE_COLUMNS = [
    {
      title: "Local Time",
      field: "localTime",
      editable: "never",
    },
    {
      title: "Type",
      field: "type",
      editable: "never",
    },
    {
      title: "Source",
      field: "source",
      editable: "never",
    },
    {
      title: "Title",
      field: "title",
      editable: "never",
    },
    {
      title: "",
      field: "read",
      editable: "never",
      render: (rowData) => {
        if (!rowData.read) {
          return (
            <div className="flex justify-center">
              <h1 className="bg-yellow-400 text-white font-bold w-fit p-1 rounded">
                New
              </h1>
            </div>
          );
        }
        return null;
      },
    },
  ];

  const navigate = useNavigate();

  const [data, setData] = useState([
    {
      localTime: "August 30, 2024  23:33",
      type: "Warning",
      source: "El Watan",
      title:
        "The Algerian government has announced a new set of measures to combat the spread of ...",
      read: false,
    },
    {
      localTime: "August 30, 2024  23:33",
      type: "Warning",
      source: "El Watan",
      title:
        "The Algerian government has announced a new set of measures to combat the spread of ...",
      read: false,
    },
    {
      localTime: "August 30, 2024  23:33",
      type: "Warning",
      source: "El Watan",
      title:
        "The Algerian government has announced a new set of measures to combat the spread of ...",
      read: false,
    },
    {
      localTime: "August 30, 2024  23:33",
      type: "Warning",
      source: "El Watan",
      title:
        "The Algerian government has announced a new set of measures to combat the spread of ...",
      read: true,
    },
    {
      localTime: "August 30, 2024  23:33",
      type: "Not",
      source: "El Watan",
      title:
        "The Algerian government has announced a new set of measures to combat the spread of ...",
      read: true,
    },
    // Add other data items here
  ]);

  const markAsRead = (rowData) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.localTime === rowData.localTime && item.title === rowData.title
          ? { ...item, read: true }
          : item
      )
    );
  };

  return (
    <div className="p-10 h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <div style={{ flex: 1, overflow: "hidden" }}>
        <MaterialTable
          isLoading={loading}
          columns={EDITABLE_COLUMNS}
          data={data}
          title=""
          editable={{}}
          onRowClick={(event, rowData) => {
            navigate(`${rowData.idClient}`);
          }}
          actions={[
            {
              icon: () => <MdDone className="text-bleuF" />,
              tooltip: "Mark as Read",
              onClick: (event, rowData) => {
                markAsRead(rowData);
              },
            },
          ]}
          options={{
            headerStyle: {
              borderBottom: "solid 1px black",
              color: "#757575",
              fontSize: "12px",
              fontWeight: "600",
              lineHeight: "18px",
              paddingBottom: "10px",
              textAlign: "center",
            },
            tableLayout: "fixed", // Optional: helps with consistent column width
            maxBodyHeight: "calc(100vh - 100px)", // Adjust based on the header's height
            overflowY: "auto", // Enable vertical scroll within the table
          }}
        />
      </div>
    </div>
  );
};
