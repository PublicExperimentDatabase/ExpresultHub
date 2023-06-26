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
    field: "title",
    headerName: "Title",
    flex: 4,
    sortable: false,
    renderCell: (params) => {
      return (
        <a href={`/experiment/${params.row.id}`} style={{ color: "blue" }}>
          {params.value}
        </a>
      );
    },
  },
  { field: "owner", headerName: "Owner", flex: 1, sortable: false },
  {
    field: "lastModified",
    headerName: "Last Modified",
    flex: 1,
    valueFormatter: (params) => params.value.slice(0, 10),
  },
  {
    field: "created",
    headerName: "Created",
    flex: 1,
    valueFormatter: (params) => params.value.slice(0, 10),
  },
];

const ExperimentTable = ({ rows, handleDelete, handleToggleModal }: Props) => {
  const [rowsSelctedIds, setRowsSelectedIds] = React.useState<String[]>([]);
  return (
    <div style={{ width: "100%" }}>
      <ExperimentTableToolbar
        rowsSelctedIds={rowsSelctedIds}
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
        onRowSelectionModelChange={(ids) => {
          const selectedIds = ids.map((id) => String(id));
          setRowsSelectedIds(selectedIds);
        }}
        getRowId={(row: any) => row.id}
      />
    </div>
  );
};

export default ExperimentTable;
