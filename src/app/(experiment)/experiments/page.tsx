"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
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

  const memoizedExperiments = useMemo(() => {
    return experiments;
  }, [experiments]);

  useEffect(() => {
    const fetchExperiments = async () => {
      isCreateNew && setIsCreateNew(false);
      isDelete && setIsDelete(false);
      try {
        const dbExperiments = await fetch(`/api/experiments`, {
          method: "GET",
        })
          .then((res) => res.json())
          .then((data) => data.experiments);

        const transformedExperiments = dbExperiments.map((experiment: any) => {
          return {
            name: experiment.name,
            lastModified: experiment.lastModified,
            created: experiment.createdAt,
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
    <Card>
      <CardContent>
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
        <ExperimentTable
          rows={memoizedExperiments}
          handleDelete={handleDelete}
          handleToggleModal={handleToggleModal}
        />
        <NewExperimentModal
          isModalOpen={isModalOpen}
          handleToggleModal={handleToggleModal}
          setIsCreateNew={setIsCreateNew}
        />
      </CardContent>
    </Card>
  );
};

export default Page;

