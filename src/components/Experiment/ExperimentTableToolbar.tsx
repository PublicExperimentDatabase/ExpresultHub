import React from "react";
import TableToolbar from "../TableToolbar";

interface Props {
  rowsSelectedNames: String[];
  handleDelete: () => void;
  handleToggleModal: () => void;
}

const ExperimentTableToolbar = ({ rowsSelectedNames, handleDelete, handleToggleModal }: Props) => {
  const deleteSelected = async () => {
    handleDelete();
    await fetch(`/api/experiments`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ names: rowsSelectedNames }),
    });
  };

  return (
    <TableToolbar
      rowsSelectedNames={rowsSelectedNames}
      handleDelete={handleDelete}
      handleToggleModal={handleToggleModal}
      delteSelected={deleteSelected}
      tableTitle={"All Experiments"}
      addButtonTitle={"New Experiment"}
    />
  );
};

export default ExperimentTableToolbar;
