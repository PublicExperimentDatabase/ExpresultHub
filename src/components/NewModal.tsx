import React, { useState } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";

interface Props {
  isModalOpen: boolean;
  handleToggleModal: () => void;
  handleCreate: (name: string, description?: string) => void;
  modalTitle: string;
}

const NewModal = ({ isModalOpen, handleToggleModal, handleCreate, modalTitle }: Props) => {
  const [name, setName] = useState<string>();
  const [description, setDescription] = useState<string>();

  return (
    <Modal open={isModalOpen} onClose={handleToggleModal}>
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Box bgcolor="white" paddingX={4} width="40vw">
          <Typography
            variant="h5"
            fontWeight="bold"
            fontSize="xl"
            mt={2}
            mb={1}
            px={1}
            color="primary"
            textAlign="left"
          >
            {modalTitle}
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-evenly"
          >
            <TextField
              variant="outlined"
              placeholder="Title"
              fullWidth
              sx={{ margin: 1 }}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              variant="outlined"
              placeholder="Description"
              fullWidth
              multiline
              rows={3}
              sx={{ margin: 1 }}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Box sx={{ margin: 1 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  name && handleCreate(name, description);
                }}
                sx={{ marginX: 2 }}
              >
                Submit
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleToggleModal}
                sx={{ marginX: 2 }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default NewModal;
