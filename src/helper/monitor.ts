import dbConnect from "./dbConnect";
import { Experiment } from "../types/database/Experiment";
import { cpuUsageMonitoring } from "./monitorCommands/mpstat";
import { memoUsageMonitoring } from "./monitorCommands/vmstat";
import { ioStatMonitoring } from "./monitorCommands/iostat";

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
  const existingIteration = (await Experiment.findOne(
    {
      name: experimentName,
      "buckets.name": bucketName,
      "buckets.iterations.name": iterationName,
    },
    { "buckets.$": 1 }
  ).then((experiment: any) =>
    experiment.buckets[0].iterations.find((iteration: any) => iteration.name === iterationName)
  )) as any;
  return { existingIteration };
}

interface DataPoint {
  header: string;
  val: number | string;
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
      {
        command: "Memory usage",
        interval: interval,
        record: [],
      },
      {
        command: "IO statistics",
        interval: interval,
        record: [],
      },
      // ...
    ];

    existingIteration.output = { EnvironmentData: newEnvironmentData };
    existingIteration.timestamp.startTime = new Date();

    cpuUsageMonitoring(interval, existingIteration);
    memoUsageMonitoring(interval, existingIteration);
    ioStatMonitoring(interval, existingIteration);
    // ...

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
