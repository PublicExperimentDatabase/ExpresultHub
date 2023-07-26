import React from "react";
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface Command {
  command: string;
  val: string;
}

interface Iteration {
  bucket: string;
  iteration: string;
  commands: Command[];
}

interface Props {
  iterations: Iteration[];
  handleIterationDelete: (iteration: Iteration) => void;
}

const CompareTable = ({ iterations, handleIterationDelete }: Props) => {
  const headCellStyle = {
    fontWeight: "bold",
    backgroundColor: "#f2f2f2",
    borderBottom: "1px solid #ddd",
  };
  const cellStyle = {
    borderBottom: "1px solid #ddd",
  };
  return (
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
  );
};

export default CompareTable;
