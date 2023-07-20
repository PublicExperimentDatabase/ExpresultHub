"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip);

interface PageProps {
  params: {
    experimentName: string;
    bucketName: string;
    iterationName: string;
  };
}

const options = {
  responsive: true,
  height: "100",
  interaction: {
    mode: "index" as const,
    intersect: false,
  },
  stacked: false,
  plugins: {
    title: {
      display: true,
      text: "CPU Monitoring for iteration",
    },
  },
  scales: {
    y: {
      type: "linear" as const,
      display: true,
      position: "left" as const,
    },
  },
};

const Page = ({ params }: PageProps) => {
  const { experimentName, bucketName, iterationName } = params;
  const [description, setDescription] = useState("");
  const [timestamp, setTimestamp] = useState({ startTime: "", stopTime: "" });
  const [environmentData, setEnvironmentData] = useState([]);

  useEffect(() => {
    const fetchIteration = async () => {
      try {
        const response = await fetch(
          `/api/experiments/${experimentName}/buckets/${bucketName}/iterations/${iterationName}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        ).then((res) => res.json());
        setTimestamp(response.timestamp);
        setEnvironmentData(response.environmentData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchIteration();
  }, []);

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
          Name: {iterationName}
        </Typography>
        <Box my={4} px={2}>
          <Typography
            variant="h5"
            fontWeight="bold"
            fontSize="xl"
            color="textPrimary"
            textAlign="left"
          >
            Start Time
          </Typography>
          <Typography variant="body1" fontSize="md" color="textSecondary" textAlign="left">
            {timestamp.startTime}
          </Typography>
        </Box>
        <Box my={4} px={2}>
          <Typography
            variant="h5"
            fontWeight="bold"
            fontSize="xl"
            color="textPrimary"
            textAlign="left"
          >
            End Time
          </Typography>
          <Typography variant="body1" fontSize="md" color="textSecondary" textAlign="left">
            {timestamp.stopTime}
          </Typography>
        </Box>
        <Box my={4} px={2}>
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
            {environmentData.map((data: any, index) => {
              const labels = Array.from(
                { length: data.record.length },
                (_, i) => data.interval * i
              );
              const chartData = {
                labels,
                datasets: [
                  {
                    data: data.record.map((item: any) => item.val),
                    borderColor: "rgb(255, 99, 132)",
                    backgroundColor: "rgba(255, 99, 132, 0.5)",
                  },
                ],
              };
              return (
                <Box key={data._id}>
                  <Typography
                    key={index}
                    variant="h5"
                    fontSize="xl"
                    color="textPrimary"
                    textAlign="left"
                  >
                    {data.command}
                  </Typography>
                  <Typography fontSize="md" color="textSecondary" textAlign="left">
                    Interval: {data.interval}
                  </Typography>
                  <Line options={options} data={chartData} />
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Page;
