import React from "react";
import TableToolbar from "../TableToolbar";

interface Props {
  experimentName: string;
  bucketName: string;
  rowsSelectedNames: String[];
  handleDelete: () => void;
  handleToggleModal: () => void;
}

const IterationTableToolbar = ({
  experimentName,
  bucketName,
  rowsSelectedNames,
  handleDelete,
  handleToggleModal,
}: Props) => {
  const deleteSelected = async () => {
    handleDelete();
    await fetch(`/api/experiments/${experimentName}/buckets/${bucketName}/iterations`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        iterationNames: rowsSelectedNames,
      }),
    });
  };

  return (
    <TableToolbar
      rowsSelectedNames={rowsSelectedNames}
      handleDelete={handleDelete}
      handleToggleModal={handleToggleModal}
      delteSelected={deleteSelected}
      tableTitle={"All Iterations"}
      addButtonTitle={"New Iteration"}
    />
  );
};

export default IterationTableToolbar;
