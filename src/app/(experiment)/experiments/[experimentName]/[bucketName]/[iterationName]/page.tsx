"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Grid,
} from "@mui/material";
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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip);

interface PageProps {
  params: {
    experimentName: string;
    bucketName: string;
    iterationName: string;
  };
}

const chartOptions = {
  responsive: true,
  height: "200",
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
  const [timestamp, setTimestamp] = useState({ startTime: "", stopTime: "" });
  const [environmentData, setEnvironmentData] = useState([]);
  const [currentFields, setCurrentFields] = useState<string[]>([]);
  const [iteration, setIteration] = useState<string[]>();

  const handleFieldChange = (index: number, newField: string) => {
    setCurrentFields((prevFields) => {
      const updatedFields = [...prevFields];
      updatedFields[index] = newField;
      return updatedFields;
    });
  };

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
        setIteration(response);
        setTimestamp(response.timestamp);
        setEnvironmentData(response.environmentData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchIteration();
  }, [experimentName, bucketName, iterationName]);
  console.log(environmentData);

  const exportData = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(iteration)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `${experimentName}_${bucketName}_${iterationName}.json`;

    link.click();
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Link href={`experiments/${experimentName}/${bucketName}`}>
              <IconButton color="primary">
                <ArrowBackIcon />
              </IconButton>
            </Link>
            <Typography variant="h4" fontWeight="bold" color="primary" textAlign="left">
              Name: {iterationName}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" fontWeight="bold" color="textPrimary" textAlign="left" mb={1}>
              Start Time
            </Typography>
            <Typography variant="body1" fontSize="md" color="textSecondary" textAlign="left">
              {timestamp.startTime}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" fontWeight="bold" color="textPrimary" textAlign="left" mb={1}>
              End Time
            </Typography>
            <Typography variant="body1" fontSize="md" color="textSecondary" textAlign="left">
              {timestamp.stopTime}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" fontWeight="bold" color="textPrimary" textAlign="left" mt={2}>
              Environment Data
            </Typography>
            {environmentData.map((data: any, index) => {
              const headers: string[] = [];
              data.record[0].fields.forEach((item: any) => {
                if (typeof item.val === "number") {
                  headers.push(item.header);
                }
              });

              const labels = Array.from(
                { length: data.record.length },
                (_, i) => data.interval * i
              );

              const chartData = {
                labels,
                datasets: [
                  {
                    data: data.record.map((item: any) => {
                      return item.fields.find((field: any) => field.header === currentFields[index])
                        ?.val;
                    }),
                    borderColor: "rgb(255, 99, 132)",
                    backgroundColor: "rgba(255, 99, 132, 0.5)",
                  },
                ],
              };

              return (
                <Box key={data._id} mt={2}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="textPrimary"
                    textAlign="left"
                    mb={1}
                  >
                    {data.command}
                  </Typography>
                  <Typography variant="body2" fontSize="md" color="textSecondary" textAlign="left">
                    Interval: {data.interval}
                  </Typography>
                  <ToggleButtonGroup
                    color="primary"
                    value={currentFields[index]}
                    exclusive
                    onChange={(event, newField) => handleFieldChange(index, newField)}
                    aria-label="Platform"
                  >
                    {headers.map((header, i) => {
                      return (
                        <ToggleButton value={header} key={i}>
                          {header}
                        </ToggleButton>
                      );
                    })}
                  </ToggleButtonGroup>
                  <Line options={chartOptions} data={chartData} />
                </Box>
              );
            })}
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={exportData}>
              Export Data
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Page;
