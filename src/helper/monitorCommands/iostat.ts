import { spawn, ChildProcess } from "child_process";

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

export function ioStatMonitoring(interval: string, existingIteration: any, index: number): ChildProcess {
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
        const fields: {header: string, val: string | number}[] = []
        if (values && values.length === ioStatHeaders.length) {
          if (cnt - prevLineCount > 0 && (cnt - prevLineCount + 1) % iterLineCount === 0) {
            ioStatHeaders.forEach((header, i) => {
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

  return ioStat;
}
