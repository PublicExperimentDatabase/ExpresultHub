import { spawn } from "child_process";
import { z } from "zod";

let monitorProcess = global.monitorProcess;

export async function POST(req: Request, res: Response) {
  const body = await req.json();

  const { experimentTitle, bucketTitle, iterationTitle, interval } = z
    .object({
      experimentTitle: z.string(),
      bucketTitle: z.string(),
      iterationTitle: z.string(),
      interval: z.string(),
    })
    .parse(body);

  if (!monitorProcess) {
    monitorProcess = global.monitorProcess = spawn(
      "ts-node",
      ["src/helper/monitor.ts", experimentTitle, bucketTitle, iterationTitle, interval],
      {
        detached: true,
        stdio: "inherit",
      }
    );
    monitorProcess.unref();
    return new Response(
      JSON.stringify({
        message: "Monitor started",
      }),
      {
        status: 200,
      }
    );
  } else {
    JSON.stringify({
      message: "Already in monitor",
    }),
      {
        status: 200,
      };
  }
}
