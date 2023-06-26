import osUtils from "os-utils";
import dbConnect from "./dbConnect";
import { Experiment } from "../types/database/Experiment";

const experimentTitle = process.argv[2];
const bucketTitle = process.argv[3];
const iterationTitle = process.argv[4];
const interval = parseInt(process.argv[5]);

async function getIterationDatabase(
  experimentTitle: string,
  bucketTitle: string,
  iterationTitle: string
) {
  await dbConnect();
  const existingIteration = await Experiment.findOne(
    {
      title: experimentTitle,
      "buckets.title": bucketTitle,
      "buckets.iterations.title": iterationTitle,
    },
    { "buckets.$": 1 }
  ).then((experiment: any) =>
    experiment.buckets[0].iterations.find((iteration: any) => iteration.title === iterationTitle)
  );
  return { existingIteration };
}

async function monitor() {
  let { existingIteration } = await getIterationDatabase(
    experimentTitle,
    bucketTitle,
    iterationTitle
  );

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
          title: experimentTitle,
          "buckets.title": bucketTitle,
          "buckets.iterations.title": iterationTitle,
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
            { "bucketElem.title": bucketTitle },
            { "iterationElem.title": iterationTitle },
          ],
          new: true,
        }
      );
      console.log(
        updatedExperiment.buckets[0].iterations[parseInt(iterationTitle)].output.EnvironmentData[0]
          .record
      );
    } catch (error) {
      console.error("Error saving experiment:", error);
    }
  }, interval * 1000);
}

monitor();
