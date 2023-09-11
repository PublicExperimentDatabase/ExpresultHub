"use client";

import { Box, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
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
  Colors,
} from "chart.js";
import { Line } from "react-chartjs-2";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Colors
);

interface PageProps {
  params: {
    experimentName: string;
    bucketName: string;
  };
}

interface CommandData {
  command: string;
  interval: number;
  record: { fields: DataPoint[]; timestamp: string }[];
}

const Page = ({ params }: PageProps) => {
  const { experimentName, bucketName } = params;
  const iterationNamesRef = useRef<string[]>([]);
  const iterationEnvironmentDataRef = useRef<any[]>([]);
  const [commandNames, setCommandNames] = useState<string[]>([]);
  const commandDataArraysRef = useRef<CommandData[][]>([]);
  const [currentFields, setCurrentFields] = useState<string[]>([]);

  const handleFieldChange = (index: number, newField: string) => {
    setCurrentFields((prevFields) => {
      const updatedFields = [...prevFields];
      updatedFields[index] = newField;
      return updatedFields;
    });
  };

  function setChartOptions(title: string) {
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
          text: title,
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

    return options;
  }

  useEffect(() => {
    const fetchIteration = async () => {
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
        console.log(dbIterations);
        const transformedIterations = dbIterations.map((iteration: any) => {
          return {
            name: iteration.name,
            environmentData: iteration.output.EnvironmentData,
          };
        });
        iterationNamesRef.current = transformedIterations.map((d: any) => d.name);
        iterationEnvironmentDataRef.current = transformedIterations.map(
          (d: any) => d.environmentData
        );
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchIteration();
  }, [experimentName, bucketName]);
  console.log(iterationEnvironmentData);
  useEffect(() => {
    const getDataset = () => {
      const commandDataMap = new Map<string, any[]>();
      iterationEnvironmentDataRef.current.forEach((iterationData: any) => {
        iterationData.forEach((commandData: any) => {
          const commandName = commandData.command;

          if (!commandDataMap.has(commandName)) {
            commandDataMap.set(commandName, []);
          }

          commandDataMap.get(commandName)!.push(commandData);
        });
      });
      setCommandNames(Array.from(commandDataMap.keys()) as string[]);
      commandDataArraysRef.current = Array.from(commandDataMap.values()).filter(
        Boolean
      ) as CommandData[][];
    };
    getDataset();
  }, []);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" mx={4}>
      <Box width="100%" paddingX={10}>
        <Link href={`experiments/${experimentName}/${bucketName}`}>
          <ArrowBackIcon />
        </Link>
        <Card>
          <CardContent>
            <Typography
              variant="h3"
              fontWeight="bold"
              fontSize="2xl"
              color="primary"
              textAlign="left"
            >
              Visualization
            </Typography>
            <Box my={4}>
              {commandDataArraysRef.current.map((commandData, index) => {
                const headers: string[] = [];
                commandData[0].record[0].fields.forEach((item: any) => {
                  if (typeof item.val === "number") {
                    headers.push(item.header);
                  }
                });

                const chartData = {
                  labels: Array.from(
                    { length: commandData[0].record.length },
                    (_, i) => commandData[0].interval * i
                  ),
                  datasets: commandData.map((data, i) => {
                    return {
                      label: iterationNamesRef.current[i],
                      data: data.record.map((item: any) => {
                        return item.fields.find((field: any) => field.header === currentFields[index])
                          ?.val;
                      }),
                    };
                  }),
                };
                return (
                  <Box key={index}>
                    <Typography
                      key={index}
                      variant="h5"
                      fontSize="xl"
                      color="textPrimary"
                      textAlign="left"
                    >
                      {commandData[0].command}
                    </Typography>
                    <Typography fontSize="md" color="textSecondary" textAlign="left">
                      Interval: {commandData[0].interval}
                    </Typography>
                    <Box display="flex" justifyContent="center" my={2}>
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
                    </Box>
                    <Line options={setChartOptions(commandNames[index])} data={chartData} />
                  </Box>
                );
              })}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
export default Page;
