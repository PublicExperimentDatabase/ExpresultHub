import React from "react";
import TableToolbar from "../TableToolbar";

interface Props {
  experimentId: string;
  bucketId: string;
  rowsSelctedIds: String[];
  handleDelete: () => void;
  handleToggleModal: () => void;
}

const IterationTableToolbar = ({
  experimentId,
  bucketId,
  rowsSelctedIds,
  handleDelete,
  handleToggleModal,
}: Props) => {
  const deleteSelected = async () => {
    handleDelete();
    await fetch(`/api/iteration/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        iterationIds: rowsSelctedIds,
        experimentId: experimentId,
        bucketId: bucketId,
      }),
    });
  };

  return (
    <TableToolbar
      rowsSelctedIds={rowsSelctedIds}
      handleDelete={handleDelete}
      handleToggleModal={handleToggleModal}
      delteSelected={deleteSelected}
      tableTitle={"All Iterations"}
      addButtonTitle={"New Iteration"}
    />
  );
};

export default IterationTableToolbar;
