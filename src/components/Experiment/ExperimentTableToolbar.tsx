import React from "react";
import TableToolbar from "../TableToolbar";

interface Props {
  rowsSelctedIds: String[];
  handleDelete: () => void;
  handleToggleModal: () => void;
}

const ExperimentTableToolbar = ({ rowsSelctedIds, handleDelete, handleToggleModal }: Props) => {
  const deleteSelected = async () => {
    handleDelete();
    await fetch(`/api/experiment/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: rowsSelctedIds }),
    });
  };

  return (
    <TableToolbar
      rowsSelctedIds={rowsSelctedIds}
      handleDelete={handleDelete}
      handleToggleModal={handleToggleModal}
      delteSelected={deleteSelected}
      tableTitle={"All Experiments"}
      addButtonTitle={"New Experiment"}
    />
  );
};

export default ExperimentTableToolbar;
