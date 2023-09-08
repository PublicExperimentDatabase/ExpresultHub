import { spawn, ChildProcess } from "child_process";

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

const iterLineCount = 2;
const prevLineCount = 0;

export function memoUsageMonitoring(interval: string, existingIteration: any, index: number): ChildProcess {
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
        const fields: {header: string, val: string | number}[] = []
        if (values.length === memoUsageHeaders.length) {
          if (cnt - prevLineCount > 0 && (cnt - prevLineCount + 1) % iterLineCount === 0) {
            memoUsageHeaders.forEach((header, i) => {
              const val = isNaN(Number(values[i])) ? values[i] : Number(values[i]);
              fields.push({
                header: header,
                val: val,
              });
            });
            // Try to add the data points to an existing array of EnvironmentData
            try {
              existingIteration.output.EnvironmentData[index].record.push({
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
