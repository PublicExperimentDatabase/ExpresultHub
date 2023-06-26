import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import BucketTableToolbar from "./BucketTableToolbar";

interface Props {
  experimentId: string;
  rows: BucketTableRow[];
  handleDelete: () => void;
  handleToggleModal: () => void;
}

const BucketTable = ({ experimentId, rows, handleDelete, handleToggleModal }: Props) => {
  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Title",
      flex: 4,
      sortable: false,
      renderCell: (params) => {
        return (
          <a href={`/experiment/${experimentId}/${params.row.id}`} style={{ color: "blue" }}>
            {params.value}
          </a>
        );
      },
    },
    {
      field: "lastModified",
      headerName: "Last Modified",
      flex: 1,
      valueFormatter: (params) => params.value.slice(0, 10),
    },
    {
      field: "createdAt",
      headerName: "Created",
      flex: 1,
      valueFormatter: (params) => params.value.slice(0, 10),
    },
  ];

  const [rowsSelctedIds, setRowsSelectedIds] = React.useState<String[]>([]);

  return (
    <div style={{ width: "100%" }}>
      <BucketTableToolbar
        handleDelete={handleDelete}
        experimentId={experimentId}
        rowsSelctedIds={rowsSelctedIds}
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

export default BucketTable;
