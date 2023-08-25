"use client";
import React, { useState } from "react";
import { Box, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
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

const SingleFileUploader = () => {
  const [description, setDescription] = useState("");
  const [timestamp, setTimestamp] = useState({ startTime: "", stopTime: "" });
  const [environmentData, setEnvironmentData] = useState([]);
  const [currentFields, setCurrentFields] = useState<string[]>([]);
  const [iteration, setIteration] = useState<string[]>();
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleFieldChange = (index: number, newField: string) => {
    setCurrentFields((prevFields) => {
      const updatedFields = [...prevFields];
      updatedFields[index] = newField;
      return updatedFields;
    });
  };
  const handleUpload = async () => {
    if (file) {
      console.log("Uploading file...");

      const formData = new FormData();
      formData.append("file", file);

      try {
        // You can write the URL of your server or any other endpoint used for file upload
        const result = await fetch("https://httpbin.org/post", {
          method: "POST",
          body: formData,
        });

        const data = await result.json();
        setIteration(data.files.file);
        setEnvironmentData(JSON.parse(data.files.file).environmentData);
        setTimestamp(JSON.parse(data.files.file).timestamp);
        
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" mx={4}>
      <div>
        <label htmlFor="file" className="sr-only">
        <Typography
            variant="h5"
            fontWeight="bold"
            fontSize="xl"
            color="textPrimary"
            textAlign="left"
          >
            Choose a File
          </Typography>
        </label>
        <input id="file" type="file" onChange={handleFileChange} />
      </div>
      {file && (
        <Typography variant="body1" fontSize="md" color="text" textAlign="left">
        <section>
          File details:
          <ul>
            <li>Name: {file.name}</li>
            <li>Type: {file.type}</li>
            <li>Size: {file.size} bytes</li>
          </ul>
        </section>
      </Typography>
        
      )}
      {file && <button onClick={handleUpload}>Upload a file</button>}
      </Box>
      {iteration && <h1>file: {file.name}</h1>}
      {iteration &&
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
                  <Line options={options} data={chartData} />
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
      <div className="App">
      {/* <button type="button" onClick={exportData}>
        Export Data
      </button> */}
    </div>
    </Box>
    }
      
    </>
  );
};

export default SingleFileUploader;