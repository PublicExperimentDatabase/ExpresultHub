"use client";

import { Box, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
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
  const [iterationNames, setIterationNames] = useState([]);
  const [iterationEnvironmentData, setIterationEnvironmentData] = useState([]);
  const [commandNames, setCommandNames] = useState<string[]>([]);
  const [commandDataArrays, setCommandDataArrays] = useState<CommandData[][]>([]);
  const [currentField, setCurrentField] = React.useState("%usr");

  const handleFieldChange = (event: React.MouseEvent<HTMLElement>, newField: string) => {
    setCurrentField(newField);
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
          `/api/experiments/${experimentName}/buckets/${bucketName}/iterations`, //fetching the iterations for showing the data in the drop down box
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
        setIterationNames(transformedIterations.map((d: any) => d.name));
        setIterationEnvironmentData(transformedIterations.map((d: any) => d.environmentData));
      } catch (error) {
        console.error(error);
      }
    };

    fetchIteration();
  }, [experimentName, bucketName]);

  useEffect(() => {
    const getDataset = () => {
      const commandDataMap = new Map<string, any[]>();
      iterationEnvironmentData.forEach((iterationData: any) => {
        iterationData.forEach((commandData: any) => {
          const commandName = commandData.command;

          if (!commandDataMap.has(commandName)) {
            commandDataMap.set(commandName, []);
          }

          commandDataMap.get(commandName)!.push(commandData);
        });
      });
      setCommandNames(Array.from(commandDataMap.keys()) as string[]);
      setCommandDataArrays(Array.from(commandDataMap.values()).filter(Boolean) as CommandData[][]);
    };
    getDataset();
  }, [iterationEnvironmentData]);

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
          <Box my={4}>
            {commandDataArrays.map((commandData, index) => {
              console.log(commandData);
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
                datasets: commandData.map((commandData, i) => {
                  return {
                    label: iterationNames[i],
                    data: commandData.record.map((item: any) => {
                      return item.fields.find((field: any) => field.header === currentField).val;
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
                    {commandData[index].command}
                  </Typography>
                  <Typography fontSize="md" color="textSecondary" textAlign="left">
                    Interval: {commandData[index].interval}
                  </Typography>
                  <Box display="flex" justifyContent="center" my={2}>
                    <ToggleButtonGroup
                      color="primary"
                      value={currentField}
                      exclusive
                      onChange={handleFieldChange}
                      aria-label="Platform"
                    >
                      {headers.map((header) => {
                        return (
                          <ToggleButton value={header} key={index}>
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
        </Box>
      </Box>
    </Box>
  );
};
export default Page;
