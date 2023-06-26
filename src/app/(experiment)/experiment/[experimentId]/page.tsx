"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import BucketTable from "@/components/Bucket/BucketTable";
import NewBucketModal from "@/components/Bucket/NewBucketModal";

interface PageProps {
  params: {
    experimentId: string;
  };
}

const Page = ({ params }: PageProps) => {
  const { experimentId } = params;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [buckets, setBuckets] = useState<BucketTableRow[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateNew, setIsCreateNew] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const handleToggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleDelete = () => {
    setIsDelete(!isDelete);
  };

  useEffect(() => {
    const fetchIteration = async () => {
      isCreateNew && setIsCreateNew(false);
      isDelete && setIsDelete(false);
      try {
        const response = await fetch(`/api/bucket/get`, {
          method: "POST",
          body: JSON.stringify({ experimentId: experimentId }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => res.json());

        const dbBuckets = response.buckets;
        if (dbBuckets) {
          const transformedBuckets = dbBuckets.map((bucket: any) => {
            console.log(bucket);
            return {
              id: bucket._id,
              title: bucket.title,
              lastModified: bucket.lastModified,
              createdAt: bucket.createdAt,
            };
          }) as BucketTableRow[];
          setBuckets(transformedBuckets);
        }

        setTitle(response.title);
        console.log(response.title);
        setDescription(response.description);
      } catch (error) {
        console.error(error);
      }
    };
    fetchIteration();
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
          {title}
        </Typography>
      </Box>
      <Box width="100%">
        <BucketTable
          experimentId={experimentId}
          rows={buckets}
          handleDelete={handleDelete}
          handleToggleModal={handleToggleModal}
        />
      </Box>

      <NewBucketModal
        isModalOpen={isModalOpen}
        experimentTitle={title}
        handleToggleModal={handleToggleModal}
        setIsCreateNew={setIsCreateNew}
      />
    </Box>
  );
};

export default Page;
