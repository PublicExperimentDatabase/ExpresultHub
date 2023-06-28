import osUtils from "os-utils";
import dbConnect from "./dbConnect";
import { Experiment } from "../types/database/Experiment";

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

async function monitor() {
  let { existingIteration } = await getIterationDatabase(experimentName, bucketName, iterationName);

  if (!existingIteration) {
    console.log("No iteration found");
    return;
  }

  const newEnvironmentData = [
    {
      command: "CPU usage",
      interval: interval,
      record: [],
    }, // ...
  ];

  existingIteration.output = { EnvironmentData: newEnvironmentData };
  existingIteration.timestamp.startTime = new Date();

  setInterval(async () => {
    const cpuUsage = await new Promise<number>((resolve, reject) => {
      osUtils.cpuUsage((usage: number) => resolve(usage));
    });

    existingIteration.output.EnvironmentData[0].record.push({
      timestamp: new Date(),
      val: cpuUsage,
    });
    existingIteration.timestamp.stopTime = new Date();

    try {
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
    } catch (error) {
      console.error("Error saving experiment:", error);
    }
  }, interval * 1000);
}

monitor();
