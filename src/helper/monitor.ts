import dbConnect from "./dbConnect";
import { Experiment } from "../types/database/Experiment";
import { spawn } from "child_process";

const experimentName = process.argv[2];
const bucketName = process.argv[3];
const iterationName = process.argv[4];
const interval = process.argv[5];

async function getIterationDatabase(
  experimentName: string,
  bucketName: string,
  iterationName: string
) {
  await dbConnect();
  const existingIteration = await Experiment.findOne(
    {
      name: experimentName,
      "buckets.name": bucketName,
      "buckets.iterations.name": iterationName,
    },
    { "buckets.$": 1 }
  ).then((experiment: any) =>
    experiment.buckets[0].iterations.find((iteration: any) => iteration.name === iterationName)
  );
  return { existingIteration };
}

function monitor() {
  getIterationDatabase(experimentName, bucketName, iterationName).then(({ existingIteration }) => {
    if (!existingIteration) {
      console.log("No iteration found");
      return;
    }

    const newEnvironmentData = [
      {
        command: "CPU usage",
        interval: interval,
        record: [],
      },
      // ...
    ];

    existingIteration.output = { EnvironmentData: newEnvironmentData };
    existingIteration.timestamp.startTime = new Date();

    // TODO: Encapsulate commands
    // Create a child process to run the "mpstat" command with a specified interval
    const cpuUsage = spawn("mpstat", [interval], {
      detached: false,
    });
    let cpuUsageHeaders: string[] = [];

    // Listen for data events from the stdout of the child process
    cpuUsage.stdout.on("data", (data: string) => {
      const lines = data?.toString().split("\n");

      if (lines.length > 2) {
        cpuUsageHeaders = lines[lines.length - 3].trim().split(/\s+/);
      }

      if (cpuUsageHeaders.length !== 0 && lines.length >= 2) {
        // Extract values from the last line
        const values = lines[lines.length - 2].trim().split(/\s+/);

        const fields: DataPoint[] = [];

        cpuUsageHeaders.forEach((header, index) => {
          if (index > 0 && index < values.length) {
            const val = isNaN(Number(values[index])) ? values[index] : Number(values[index]);
            fields.push({
              header: header,
              val: val,
            });
          }
        });

        // Try to add the data points to an existing array of EnvironmentData
        try {
          existingIteration.output.EnvironmentData[0].record.push({
            timestamp: new Date(),
            fields: fields,
          });
        } catch (error) {
          console.log(error);
        }
      }
    });

    process.on("SIGINT", async () => {
      console.log("SIGINT");
      existingIteration.timestamp.stopTime = new Date();
      const updatedExperiment = await Experiment.findOneAndUpdate(
        {
          name: experimentName,
          "buckets.name": bucketName,
          "buckets.iterations.name": iterationName,
        },
        {
          $set: {
            "buckets.$[bucketElem].iterations.$[iterationElem].output": existingIteration.output,
            "buckets.$[bucketElem].iterations.$[iterationElem].timestamp":
              existingIteration.timestamp,
          },
        },
        {
          arrayFilters: [
            { "bucketElem.name": bucketName },
            { "iterationElem.name": iterationName },
          ],
          new: true,
        }
      );
      process.exit(0);
    });
  });
}

monitor();
