import dbConnect from "./dbConnect";
import { Experiment } from "../types/database/Experiment";
import { spawn } from "child_process";

const experimentName = process.argv[2];
const bucketName = process.argv[3];
const iterationName = process.argv[4];
const interval = parseInt(process.argv[5]);

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
    const cpuUsage = spawn("mpstat", ["10"], {
      detached: false,
    });

    cpuUsage.stdout.on("data", (data: string) => {
      const lines = data?.toString().split("\n");
      if (lines) {
        const lastLine = lines[lines.length - 2];
        const fields = lastLine.trim().split(/\s+/);
        const idle = parseFloat(fields[fields.length - 1]);
        const usage = 100 - idle;
        if (!isNaN(usage)) {
          console.log(`CPU Usage: ${usage.toFixed(2)}%`);
          existingIteration.output.EnvironmentData[0].record.push({
            timestamp: new Date(),
            val: usage,
          });
        }
      }
    });

    process.on("SIGINT", async () => {
      console.log("SIGINT");
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
      console.log(
        updatedExperiment.buckets[0].iterations[parseInt(iterationName)].output.EnvironmentData[0]
          .record
      );
      process.exit(0);
    });
  });
}

monitor();
