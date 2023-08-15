import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";
import {
  Box,
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
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip
);

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

interface Command {
  command: string;
  val: string;
}
interface FullIteration {}
interface Iteration {
  bucket: string;
  iteration: string;
  commands: Command[];
}

interface Props {
  iterations: Iteration[];
  fulliterations: FullIteration[];
  handleIterationDelete: (iteration: Iteration) => void;
}

const CompareTable = ({
  iterations,
  fulliterations,
  handleIterationDelete,
}: Props) => {
  const headCellStyle = {
    fontWeight: "bold",
    backgroundColor: "#f2f2f2",
    borderBottom: "1px solid #ddd",
  };
  const cellStyle = {
    borderBottom: "1px solid #ddd",
  };

  const [currentField, setCurrentField] = React.useState("%usr");
  const handleFieldChange = (
    event: React.MouseEvent<HTMLElement>,
    newField: string
  ) => {
    setCurrentField(newField);
  };
  return (
    <>
      <Table
        sx={{ minWidth: 650 }}
        aria-label="simple tab
    le"
      >
        <TableHead>
          <TableRow>
            <TableCell
              style={{
                ...headCellStyle,
                borderRight: "1px solid #ddd",
              }}
            >
              Bucket
            </TableCell>
            {iterations.map((iteration: Iteration) => {
              return (
                <TableCell
                  align="left"
                  key={iteration.bucket}
                  style={{
                    ...headCellStyle,
                    borderRight: "1px solid #ddd",
                  }}
                >
                  {iteration.bucket}
                  <IconButton onClick={() => handleIterationDelete(iteration)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              );
            })}
          </TableRow>
          <TableRow>
            <TableCell
              style={{
                ...headCellStyle,
                borderRight: "1px solid #ddd",
              }}
            >
              Iteration
            </TableCell>
            {iterations.map((iteration: Iteration) => {
              return (
                <TableCell
                  align="left"
                  key={iteration.iteration}
                  style={{
                    ...headCellStyle,
                    borderRight: "1px solid #ddd",
                  }}
                >
                  {iteration.iteration}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {iterations[0].commands.map((command: Command, index) => (
            <TableRow key={command.command}>
              <TableCell
                style={{
                  ...cellStyle,
                  borderRight: "1px solid #ddd",
                }}
              >
                {command.command}
              </TableCell>
              {iterations.map((iteration) => (
                <TableCell
                  align="left"
                  key={`${iteration.bucket}-${iteration.iteration}-${command.command}`}
                  style={{
                    ...cellStyle,
                    borderRight: "1px solid #ddd",
                  }}
                >
                  {iteration.commands[index].val}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <>
        {fulliterations.map((iteration: any) => {
          return (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              mx={4}
              key={iteration.name}
            >
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
                  Name: {iteration.name}
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
                  <Typography
                    variant="body1"
                    fontSize="md"
                    color="textSecondary"
                    textAlign="left"
                  >
                    {iteration.timestamp.startTime}
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
                  <Typography
                    variant="body1"
                    fontSize="md"
                    color="textSecondary"
                    textAlign="left"
                  >
                    {iteration.timestamp.stopTime}
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
                    {iteration.output.EnvironmentData?.map(
                      (data: any, index: any) => {
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
                                return item.fields.find(
                                  (field: any) => field.header === currentField
                                ).val;
                              }),
                              borderColor: "rgb(255, 99, 132)",
                              backgroundColor: "rgba(255, 99, 132, 0.5)",
                            },
                            {
                              data: data.record.map((item: any) => {
                                return item.fields.find(
                                  (field: any) => field.header === currentField
                                ).val;
                              }),
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
                            <Typography
                              fontSize="md"
                              color="textSecondary"
                              textAlign="left"
                            >
                              Interval: {data.interval}
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
                            <Line options={options} data={chartData} />
                          </Box>
                        );
                      }
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          );
        })}
      </>
    </>
  );
};

export default CompareTable;
