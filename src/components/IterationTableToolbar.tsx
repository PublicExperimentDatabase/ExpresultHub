import { Button, IconButton, Toolbar, Tooltip, Typography, alpha } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";

interface Props {
  experimentId: string;
  rowsSelctedIds: String[];
  handleDelete: () => void;
  handleToggleModal: () => void;
}

const IterationTableToolbar = ({
  experimentId,
  rowsSelctedIds,
  handleDelete,
  handleToggleModal,
}: Props) => {
  const deleteSelected = async () => {
    handleDelete();
    await fetch(`/api/iteration/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ iterationIds: rowsSelctedIds, experimentId: experimentId }),
    });
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(rowsSelctedIds.length > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {rowsSelctedIds.length > 0 ? (
        <Typography sx={{ flex: "1 1 100%" }} color="inherit" variant="subtitle1" component="div">
          {rowsSelctedIds.length} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: "1 1 100%" }} variant="h6" id="tableTitle" component="div">
          All Iterations
        </Typography>
      )}
      {rowsSelctedIds.length > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={deleteSelected}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Add a new iteration">
          <Button
            onClick={() => handleToggleModal()}
            variant="contained"
            sx={{ width: "20%", height: "100%" }}
          >
            New Iteration
          </Button>
        </Tooltip>
      )}
    </Toolbar>
  );
};

export default IterationTableToolbar;
