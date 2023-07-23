let monitorProcess = global.monitorProcess;

export async function POST(req: Request, res: Response) {
  if (monitorProcess) {
    monitorProcess.kill("SIGINT");
    monitorProcess = global.monitorProcess = null;
    return new Response(
      JSON.stringify({
        message: "Monitor stopped",
      }),
      {
        status: 200,
      }
    );
  } else {
    return new Response(
      JSON.stringify({
        message: "No monitor running, please start monitor first",
      }),
      {
        status: 200,
      }
    );
  }
}
