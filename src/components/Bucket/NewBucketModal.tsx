import React from "react";
import NewModal from "../NewModal";

interface Props {
  isModalOpen: boolean;
  experimentName: string;
  handleToggleModal: () => void;
  setIsCreateNew: (isCreateNew: boolean) => void;
}

const NewBucketModal = ({
  isModalOpen,
  experimentName,
  handleToggleModal,
  setIsCreateNew,
}: Props) => {
  const createIteration = async (name: string, description?: string) => {
    handleToggleModal();
    console.log(name);
    try {
      await fetch(`/api/experiments/${experimentName}/buckets`, {
        method: "POST",
        body: JSON.stringify({
          bucketName: name,
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

export default NewBucketModal;
