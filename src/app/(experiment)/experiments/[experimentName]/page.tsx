"use client";

import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import BucketTable from "@/components/Bucket/BucketTable";
import NewBucketModal from "@/components/Bucket/NewBucketModal";
import Link from "next/link";

interface PageProps {
  params: {
    experimentName: string;
  };
}

const Page = ({ params }: PageProps) => {
  const { experimentName } = params;
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
        const response = await fetch(`/api/experiments/${experimentName}/buckets`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => res.json());

        const dbBuckets = response.buckets;
        if (dbBuckets) {
          const transformedBuckets = dbBuckets.map((bucket: any) => {
            console.log(bucket);
            return {
              name: bucket.name,
              lastModified: bucket.lastModified,
              createdAt: bucket.createdAt,
            };
          }) as BucketTableRow[];
          setBuckets(transformedBuckets);
        }
        setDescription(response.description);
      } catch (error) {
        console.error(error);
      }
    };
    fetchIteration();
  }, [isCreateNew, isDelete, experimentName]);

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
          {experimentName}
        </Typography>
      </Box>
      <Box width="100%">
        <BucketTable
          experimentName={experimentName}
          rows={buckets}
          handleDelete={handleDelete}
          handleToggleModal={handleToggleModal}
        />
      </Box>
      <Button>
        <Link href={`/experiments/${experimentName}/visualization`}>Visualization</Link>
      </Button>

      <NewBucketModal
        isModalOpen={isModalOpen}
        experimentName={experimentName}
        handleToggleModal={handleToggleModal}
        setIsCreateNew={setIsCreateNew}
      />
    </Box>
  );
};

export default Page;
