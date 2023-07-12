import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import IterationTableToolbar from "./IterationTableToolbar";

interface Props {
  experimentName: string;
  bucketName: string;
  rows: IterationTableRow[];
  handleDelete: () => void;
  handleToggleModal: () => void;
}

const IterationTable = ({
  experimentName,
  bucketName,
  rows,
  handleDelete,
  handleToggleModal,
}: Props) => {
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 4,
      sortable: false,
      renderCell: (params) => {
        return (
          <a
            href={`/experiments/${experimentName}/${bucketName}/${params.row.name}`}
            style={{ color: "blue" }}
          >
            {params.value}
          </a>
        );
      },
    },
    {
      field: "startTime",
      headerName: "Start Time",
      flex: 1,
      valueFormatter: (params) => params.value?.slice(0, 10),
    },
    {
      field: "stopTime",
      headerName: "Stop Time",
      flex: 1,
      valueFormatter: (params) => params.value?.slice(0, 10),
    },
  ];

  const [rowsSelectedNames, setRowsSelectedNames] = React.useState<String[]>([]);

  return (
    <div style={{ width: "100%" }}>
      <IterationTableToolbar
        handleDelete={handleDelete}
        experimentName={experimentName}
        bucketName={bucketName}
        rowsSelectedNames={rowsSelectedNames}
        // handleDelete={handleDelete}
        handleToggleModal={handleToggleModal}
      />
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
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

export default IterationTable;
