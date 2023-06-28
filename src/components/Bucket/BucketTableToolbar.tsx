import React from "react";
import TableToolbar from "../TableToolbar";

interface Props {
  experimentName: string;
  rowsSelectedNames: String[];
  handleDelete: () => void;
  handleToggleModal: () => void;
}

const BucketTableToolbar = ({
  experimentName,
  rowsSelectedNames,
  handleDelete,
  handleToggleModal,
}: Props) => {
  const deleteSelected = async () => {
    handleDelete();
    await fetch(`/api/experiments/${experimentName}/buckets`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bucketNames: rowsSelectedNames }),
    });
  };

  return (
    <TableToolbar
      rowsSelectedNames={rowsSelectedNames}
      handleDelete={handleDelete}
      handleToggleModal={handleToggleModal}
      delteSelected={deleteSelected}
      tableTitle={"All Buckets"}
      addButtonTitle={"New Bucket"}
    />
  );
};

export default BucketTableToolbar;
