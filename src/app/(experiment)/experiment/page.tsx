"use client";

import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import ExperimentTable from "@/components/Experiment/ExperimentTable";
import NewExperimentModal from "@/components/Experiment/NewExperimentModal";

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [experiments, setExperiments] = useState<ExperimentTableRow[]>([]);
  const [isCreateNew, setIsCreateNew] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);

  const handleToggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleDelete = () => {
    setIsDelete(!isDelete);
  };

  useEffect(() => {
    const fetchExperiments = async () => {
      isCreateNew && setIsCreateNew(false);
      isDelete && setIsDelete(false);
      try {
        const dbExperiments = await fetch(`/api/experiment/get`, {
          method: "GET",
        })
          .then((res) => res.json())
          .then((data) => data.experiments);

        const transformedExperiments = dbExperiments.map((experiment: any) => {
          return {
            id: experiment.id,
            title: experiment.title,
            owner: experiment.owner,
            lastModified: experiment.lastModified,
            created: experiment.created,
          };
        }) as ExperimentTableRow[];

        setExperiments(transformedExperiments);
      } catch (error) {
        console.error(error);
      }
    };

    fetchExperiments();
  }, [isCreateNew, isDelete]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" mx={4}>
      <Box width="100%" paddingX={10}>
        <Typography
          variant="h3"
          fontWeight="bold"
          fontSize="2xl"
          my={4}
          px={2}
          color="primary"
          textAlign="left"
        >
          Experiments
        </Typography>
      </Box>
      <Box width="100%">
        {/* <ExperimentTable rows={rows} /> */}
        <ExperimentTable
          rows={experiments}
          handleDelete={handleDelete}
          handleToggleModal={handleToggleModal}
        />
      </Box>

      <NewExperimentModal
        isModalOpen={isModalOpen}
        handleToggleModal={handleToggleModal}
        setIsCreateNew={setIsCreateNew}
      />
    </Box>
  );
};

export default Page;
