import { Button, IconButton, Toolbar, Tooltip, Typography, alpha } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";

interface Props {
  rowsSelectedNames: String[];
  handleDelete: () => void;
  handleToggleModal: () => void;
  delteSelected: () => void;
  tableTitle: string;
  addButtonTitle: string;
}

const TableToolbar = ({
  rowsSelectedNames,
  handleDelete,
  handleToggleModal,
  delteSelected,
  tableTitle,
  addButtonTitle,
}: Props) => {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(rowsSelectedNames.length > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {rowsSelectedNames.length > 0 ? (
        <Typography sx={{ flex: "1 1 100%" }} color="inherit" variant="subtitle1" component="div">
          {rowsSelectedNames.length} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: "1 1 100%" }} variant="h6" id="tableTitle" component="div">
          {tableTitle}
        </Typography>
      )}
      {rowsSelectedNames.length > 0 ? (
        <Tooltip title="Delete">
          <IconButton
            onClick={() => {
              delteSelected();
              handleDelete();
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Add a new experiment">
          <Button
            onClick={() => handleToggleModal()}
            variant="contained"
            sx={{ width: "20%", height: "100%" }}
          >
            {addButtonTitle}
          </Button>
        </Tooltip>
      )}
    </Toolbar>
  );
};

export default TableToolbar;
