import { spawn, ChildProcess } from "child_process";

interface DataPoint {
  header: string;
  val: string | number;
}

const ioStatHeaders: string[] = [
  "Device",
  "tps",
  "kB_read/s",
  "kB_wrtn/s",
  "kB_dscd/s",
  "kB_read",
  "kB_wrtn",
  "kB_dscd",
];

const iterLineCount = 2;
const prevLineCount = 0;

export function ioStatMonitoring(interval: string, existingIteration: any): ChildProcess {
  // Create a child process to run the "mpstat" command with a specified interval
  const ioStat = spawn("iostat", [interval], { detached: false });
  let cnt = 0;

  // Listen for data events from the stdout of the child process
  ioStat.stdout.on("data", (data: string) => {
    const lines = data?.toString().split("\n");
    console.log(lines);

    lines.forEach((line) => {
      if (line !== "") {
        const values = line.split(/\s+/);
        const fields: DataPoint[] = [];
        if (values && values.length === ioStatHeaders.length) {
          if (cnt - prevLineCount > 0 && (cnt - prevLineCount + 1) % iterLineCount === 0) {
            ioStatHeaders.forEach((header, index) => {
              const val = isNaN(Number(values[index])) ? values[index] : Number(values[index]);
              fields.push({
                header: header,
                val: val,
              });
            });
            // Try to add the data points to an existing array of EnvironmentData
            try {
              existingIteration.output.EnvironmentData[3].record.push({
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

  return ioStat;
}
