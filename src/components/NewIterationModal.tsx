import React from "react";
import NewModal from "./NewModal";

interface Props {
  isModalOpen: boolean;
  experimentTitle: string;
  handleToggleModal: () => void;
  setIsCreateNew: (isCreateNew: boolean) => void;
}

const NewIterationModal = ({
  isModalOpen,
  experimentTitle,
  handleToggleModal,
  setIsCreateNew,
}: Props) => {
  const createIteration = async (title: string, description?: string) => {
    handleToggleModal();
    try {
      await fetch(`/api/iteration/create`, {
        method: "POST",
        body: JSON.stringify({
          experimentTitle: experimentTitle,
          iterationTitle: title,
          description: description,
        }),
      });
    } catch (error) {
      console.log(error);
    }
    setIsCreateNew(true);
  };
  return (
    <NewModal
      isModalOpen={isModalOpen}
      handleToggleModal={handleToggleModal}
      handleCreate={createIteration}
      modalTitle={"Add a New Iteration"}
    />
  );
};

export default NewIterationModal;
