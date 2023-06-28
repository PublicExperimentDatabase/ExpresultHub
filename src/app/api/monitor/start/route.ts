import { spawn } from "child_process";
import { z } from "zod";

let monitorProcess = global.monitorProcess;

export async function POST(req: Request, res: Response) {
  const body = await req.json();

  const { experimentName, bucketName, iterationName, interval } = z
    .object({
      experimentName: z.string(),
      bucketName: z.string(),
      iterationName: z.string(),
      interval: z.string(),
    })
    .parse(body);

  if (!monitorProcess) {
    monitorProcess = global.monitorProcess = spawn(
      "ts-node",
      ["src/helper/monitor.ts", experimentName, bucketName, iterationName, interval],
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
