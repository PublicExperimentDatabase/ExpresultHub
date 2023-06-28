import React from "react";
import NewModal from "../NewModal";

interface Props {
  isModalOpen: boolean;
  experimentName: string;
  bucketName: string;
  handleToggleModal: () => void;
  setIsCreateNew: (isCreateNew: boolean) => void;
}

const NewIterationModal = ({
  isModalOpen,
  experimentName,
  bucketName,
  handleToggleModal,
  setIsCreateNew,
}: Props) => {
  const createIteration = async (name: string, description?: string) => {
    handleToggleModal();
    try {
      await fetch(`/api/experiments/${experimentName}/buckets/${bucketName}/iterations`, {
        method: "POST",
        body: JSON.stringify({
          iterationName: name,
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
