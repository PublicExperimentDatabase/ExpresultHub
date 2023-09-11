"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import IterationTable from "@/components/Iteration/IterationTable";
import NewIterationModal from "@/components/Iteration/NewIterationModal";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface PageProps {
  params: {
    experimentName: string;
    bucketName: string;
  };
}

const Page = ({ params }: PageProps) => {
  const { experimentName, bucketName } = params;
  const [description, setDescription] = useState("");
  const [iterations, setIterations] = useState<IterationTableRow[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateNew, setIsCreateNew] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const handleVisualizationClick = () => {
    const visualizationPageUrl = `/experiments/${experimentName}/${bucketName}/visualization`;
    window.location.href = visualizationPageUrl;
  };

  const handleToggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleDelete = () => {
    setIsDelete(!isDelete);
  };

  const memoizedIterations = useMemo(() => {
    return iterations;
  }, [iterations]);

  useEffect(() => {
    const fetchIteration = async () => {
      isCreateNew && setIsCreateNew(false);
      isDelete && setIsDelete(false);
      try {
        const response = await fetch(
          `/api/experiments/${experimentName}/buckets/${bucketName}/iterations`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        ).then((res) => res.json());

        const dbIterations = response.iterations;
        const transformedIterations = dbIterations.map((iteration: any) => {
          return {
            name: iteration.name,
            startTime: iteration.timestamp?.startTime,
            stopTime: iteration.timestamp?.stopTime,
          };
        }) as IterationTableRow[];

        setDescription(response.description);
        setIterations(transformedIterations);
      } catch (error) {
        console.error(error);
      }
    };
    fetchIteration();
  }, [isCreateNew, isDelete, experimentName, bucketName]);

  return (
    <Card>
      <CardContent>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          mx={4}
        >
          <Box width="100%" paddingX={10}>
            <Link href={`experiments/${experimentName}`}>
              <ArrowBackIcon />
            </Link>
            <Typography
              variant="h3"
              fontWeight="bold"
              fontSize="2xl"
              my={4}
              px={2}
              color="primary"
              textAlign="left"
            >
              {bucketName}
            </Typography>
          </Box>
          <Box width="100%">
            <IterationTable
              experimentName={experimentName}
              bucketName={bucketName}
              rows={memoizedIterations}
              handleDelete={handleDelete}
              handleToggleModal={handleToggleModal}
            />
          </Box>
          <Button variant="contained" color="primary" onClick={handleVisualizationClick}>
            Visualization
          </Button>

          <NewIterationModal
            isModalOpen={isModalOpen}
            experimentName={experimentName}
            bucketName={bucketName}
            handleToggleModal={handleToggleModal}
            setIsCreateNew={setIsCreateNew}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default Page;
