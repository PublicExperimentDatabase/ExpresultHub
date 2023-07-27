"use client";

import CompareTable from "@/components/Visualization/CompareIterationTable";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

interface PageProps {
  params: {
    experimentName: string;
  };
}

const Page = ({ params }: PageProps) => {
  const { experimentName } = params;
  const [selectBucket, setSelectBucket] = useState("");
  const [selectIteration, setSelectIteration] = useState("");
  const [buckets, setBuckets] = useState([]);
  const [iterations, setIterations] = useState([]);
  const [compareIterations, setCompareIterations] = useState<any[]>([]);

  useEffect(() => {
    const fetchBucket = async () => {
      try {
        const response = await fetch(`/api/experiments/${experimentName}/buckets`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => res.json());
        setBuckets(response.buckets.filter((bucket: any) => bucket.iterations.length > 0));
      } catch (error) {
        console.error(error);
      }
    };
    fetchBucket();
  }, [experimentName]);

  useEffect(() => {
    const fetchIteration = async () => {
      if (!!selectBucket) {
        try {
          const response = await fetch(
            `/api/experiments/${experimentName}/buckets/${selectBucket}/iterations`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          ).then((res) => res.json());
          setIterations(response.iterations);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchIteration();
  }, [selectBucket, experimentName]);

  useEffect(() => {
    const storedCompareIterations = localStorage.getItem("compareIterations");
    if (storedCompareIterations) {
      setCompareIterations(JSON.parse(storedCompareIterations));
    }
  }, []);

  const handleBucketChange = (event: SelectChangeEvent) => {
    setSelectBucket(event.target.value as string);
  };
  const handleIterationChange = (event: SelectChangeEvent) => {
    setSelectIteration(event.target.value as string);
  };
  const handleIterationAdd = () => {
    const addedIteration = iterations.find(
      (iteration: any) => iteration.name === selectIteration
    ) as any;
    if (addedIteration) {
      const updatedIteration = {
        bucket: selectBucket,
        iteration: addedIteration.name,
        commands: [
          {
            command: "Run time (s)",
            val:
              (new Date(addedIteration.timestamp?.stopTime).getTime() -
                new Date(addedIteration.timestamp?.startTime).getTime()) /
              1000,
          },
        ],
      };
      setCompareIterations([...compareIterations, updatedIteration]);
      localStorage.setItem(
        "compareIterations",
        JSON.stringify([...compareIterations, updatedIteration])
      );
    }
  };

  const handleIterationDelete = (iteration: any) => {
    const updatedIterations = compareIterations.filter((i) => i !== iteration);
    setCompareIterations(updatedIterations);
    localStorage.setItem("compareIterations", JSON.stringify(updatedIterations));
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" mx={4}>
      <Box width="100%" paddingX={10}>
        <Box my={4} px={2}>
          <Typography
            variant="h3"
            fontWeight="bold"
            fontSize="2xl"
            color="primary"
            textAlign="left"
          >
            Visualization
          </Typography>

          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            my={4}
          >
            <FormControl sx={{ width: "35%" }}>
              <InputLabel>Bucket</InputLabel>
              <Select value={selectBucket} label="Bucket" onChange={handleBucketChange}>
                {buckets.map((bucket: any, index) => (
                  <MenuItem value={bucket.name} key={index}>
                    {bucket.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ width: "35%" }}>
              <InputLabel>Iteration</InputLabel>
              <Select value={selectIteration} label="Iteration" onChange={handleIterationChange}>
                {iterations.length > 0 &&
                  iterations?.map((iteration: any, index) => (
                    <MenuItem value={iteration.name} key={index}>
                      {iteration.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <Button
              onClick={handleIterationAdd}
              variant="contained"
              sx={{ width: "20%", height: "100%" }}
            >
              Add
            </Button>
          </Box>

          <Box my={4}>
            <Typography
              variant="h4"
              fontWeight="bold"
              fontSize="2xl"
              color="textPrimary"
              textAlign="left"
            >
              Environment Data
            </Typography>
            <Box my={4}>
              {compareIterations.length > 0 && (
                <CompareTable
                  iterations={compareIterations}
                  handleIterationDelete={handleIterationDelete}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Page;
