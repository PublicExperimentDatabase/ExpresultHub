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
interface CommandData {
  command: string;
  interval: number;
  record: { fields: DataPoint[]; timestamp: string }[];
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

  const [iterationNames, setIterationNames] = useState([]);
  const [iterationEnvironmentData, setIterationEnvironmentData] = useState([]);
  const [commandNames, setCommandNames] = useState<string[]>([]);
  const [commandDataArrays, setCommandDataArrays] = useState<CommandData[][]>(
    []
  );
  const [currentFields, setCurrentFields] = useState<string[]>([]);
  const handleFieldChange = (index: number, newField: string) => {
    setCurrentFields((prevFields) => {
      const updatedFields = [...prevFields];
      updatedFields[index] = newField;
      return updatedFields;
    });
  };
  useEffect(() => {
    const transformedIterations: any = fulliterations.map((iteration: any) => {
      return {
        name: iteration.name,
        environmentData: iteration.output.EnvironmentData,
      };
    });
    setIterationNames(transformedIterations.map((d: FullIteration) => d.name));
    setIterationEnvironmentData(
      transformedIterations.map((d: FullIteration) => d.environmentData)
    );
  }, [fulliterations]);
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
      setCommandDataArrays(
        Array.from(commandDataMap.values()).filter(Boolean) as CommandData[][]
      );
    };
    getDataset();
  }, [iterationEnvironmentData]);
  const exportData = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(fulliterations)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `combined_data.json`;

    link.click();
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
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          mx={4}
        >
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
                        label: iterationNames[i],
                        data: data.record.map((item: any) => {
                          return item.fields.find(
                            (field: any) =>
                              field.header === currentFields[index]
                          )?.val;
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
                      <Typography
                        fontSize="md"
                        color="textSecondary"
                        textAlign="left"
                      >
                        Interval: {commandData[0].interval}
                      </Typography>
                      <Box display="flex" justifyContent="center" my={2}>
                        <ToggleButtonGroup
                          color="primary"
                          value={currentFields[index]}
                          exclusive
                          onChange={(event, newField) =>
                            handleFieldChange(index, newField)
                          }
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
                      <Line
                        options={setChartOptions(commandNames[index])}
                        data={chartData}
                      />
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
        </Box>
      </>
      <div className="App">
        <button type="button" onClick={exportData}>
          Export Data
        </button>
      </div>
    </>
  );
};

export default CompareTable;
