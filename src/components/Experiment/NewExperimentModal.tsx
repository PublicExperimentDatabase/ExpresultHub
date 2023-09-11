import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import NewModal from "../NewModal";

interface NewExperimentModalProps {
  isModalOpen: boolean;
  handleToggleModal: () => void;
  setIsCreateNew: (isCreateNew: boolean) => void;
}

const NewExperimentModal = ({
  isModalOpen,
  handleToggleModal,
  setIsCreateNew,
}: NewExperimentModalProps) => {
  const createExperiment = async (name: string, description?: string) => {
    handleToggleModal();
    try {
      await fetch(`/api/experiments`, {
        method: "POST",
        body: JSON.stringify({ name: name, description: description }),
      });
      setIsCreateNew(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={isModalOpen} onClose={handleToggleModal} maxWidth="sm" fullWidth>
      <DialogTitle>Add a New Experiment</DialogTitle>
      <DialogContent>
        <TextField
          label="Experiment Name"
          variant="outlined"
          fullWidth
          margin="dense"
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          margin="dense"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleToggleModal} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => createExperiment("Experiment Name")} // You can replace "Experiment Name" with the actual name
          color="primary"
          variant="contained"
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewExperimentModal;
