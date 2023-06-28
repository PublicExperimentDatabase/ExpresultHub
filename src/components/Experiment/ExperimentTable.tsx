import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Link from "next/link";
import ExperimentTableToolbar from "./ExperimentTableToolbar";

interface Props {
  rows: ExperimentTableRow[];
  handleDelete: () => void;
  handleToggleModal: () => void;
}

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    flex: 4,
    sortable: false,
    renderCell: (params) => {
      return (
        <a href={`/experiments/${params.row.name}`} style={{ color: "blue" }}>
          {params.value}
        </a>
      );
    },
  },
  {
    field: "lastModified",
    headerName: "Last Modified",
    flex: 1,
    valueFormatter: (params) => params.value?.slice(0, 10),
  },
  {
    field: "created",
    headerName: "Created",
    flex: 1,
    valueFormatter: (params) => params.value?.slice(0, 10),
  },
];

const ExperimentTable = ({ rows, handleDelete, handleToggleModal }: Props) => {
  console.log(rows);
  const [rowsSelectedNames, setRowsSelectedNames] = React.useState<String[]>([]);
  return (
    <div style={{ width: "100%" }}>
      <ExperimentTableToolbar
        rowsSelectedNames={rowsSelectedNames}
        handleDelete={handleDelete}
        handleToggleModal={handleToggleModal}
      />
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
          sorting: {
            sortModel: [{ field: "lastModified", sort: "desc" }],
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        onRowSelectionModelChange={(names) => {
          setRowsSelectedNames(names.map((name) => String(name)));
        }}
        getRowId={(row: any) => row.name}
      />
    </div>
  );
};

export default ExperimentTable;
