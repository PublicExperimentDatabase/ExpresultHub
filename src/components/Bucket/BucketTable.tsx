import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import BucketTableToolbar from "./BucketTableToolbar";

interface Props {
  experimentName: string;
  rows: BucketTableRow[];
  handleDelete: () => void;
  handleToggleModal: () => void;
}

const BucketTable = ({ experimentName, rows, handleDelete, handleToggleModal }: Props) => {
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 4,
      sortable: false,
      renderCell: (params) => {
        return (
          <a href={`/experiments/${experimentName}/${params.row.name}`} style={{ color: "blue" }}>
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
      field: "createdAt",
      headerName: "Created",
      flex: 1,
      valueFormatter: (params) => params.value?.slice(0, 10),
    },
  ];

  const [rowsSelectedNames, setRowsSelectedNames] = React.useState<String[]>([]);

  return (
    <div style={{ width: "100%" }}>
      <BucketTableToolbar
        handleDelete={handleDelete}
        experimentName={experimentName}
        rowsSelectedNames={rowsSelectedNames}
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

export default BucketTable;
