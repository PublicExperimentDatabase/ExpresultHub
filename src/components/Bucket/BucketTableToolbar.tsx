import React from "react";
import TableToolbar from "../TableToolbar";

interface Props {
  experimentId: string;
  rowsSelctedIds: String[];
  handleDelete: () => void;
  handleToggleModal: () => void;
}

const BucketTableToolbar = ({
  experimentId,
  rowsSelctedIds,
  handleDelete,
  handleToggleModal,
}: Props) => {
  const deleteSelected = async () => {
    handleDelete();
    await fetch(`/api/bucket/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bucketIds: rowsSelctedIds, experimentId: experimentId }),
    });
  };

  return (
    <TableToolbar
      rowsSelctedIds={rowsSelctedIds}
      handleDelete={handleDelete}
      handleToggleModal={handleToggleModal}
      delteSelected={deleteSelected}
      tableTitle={"All Buckets"}
      addButtonTitle={"New Bucket"}
    />
  );
};

export default BucketTableToolbar;
