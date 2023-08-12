import { spawn, ChildProcess } from "child_process";

interface DataPoint {
  header: string;
  val: string | number;
}

const memoUsageHeaders: string[] = [
  "r",
  "b",
  "swpd",
  "free",
  "buff",
  "cache",
  "si",
  "so",
  "bi",
  "bo",
  "in",
  "cs",
  "us",
  "sy",
  "id",
  "wa",
  "st",
];

export function memoUsageMonitoring(interval: string, existingIteration: any): ChildProcess {
  // Create a child process to run the "mpstat" command with a specified interval
  const memoUsage = spawn("vmstat", [interval], { detached: false });
  let cnt = 0;

  // Listen for data events from the stdout of the child process
  memoUsage.stdout.on("data", (data: string) => {
    const lines = data?.toString().split("\n");
    console.log(lines);

    lines.forEach((line) => {
      if (line !== "") {
        const values = line.trim().split(/\s+/);
        const fields: DataPoint[] = [];
        if (values.length === memoUsageHeaders.length) {
          if (cnt > 0) {
            memoUsageHeaders.forEach((header, index) => {
              const val = isNaN(Number(values[index])) ? values[index] : Number(values[index]);
              fields.push({
                header: header,
                val: val,
              });
            });
            // Try to add the data points to an existing array of EnvironmentData
            try {
              existingIteration.output.EnvironmentData[1].record.push({
                timestamp: new Date(),
                fields: fields,
              });
            } catch (error) {
              console.log(error);
            }
          }
          cnt += 1;
        }
      }
    });
  });

  return memoUsage;
}
