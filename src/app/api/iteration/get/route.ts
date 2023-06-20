import { Experiment } from "@/types/database/Experiment";
import dbConnect from "@/helper/dbConnect";
import { z } from "zod";

export async function POST(req: Request, res: Response) {
  const body = await req.json();

  const { experimentId } = z
    .object({
      experimentId: z.string(),
    })
    .parse(body);

  await dbConnect();

  try {
    const existingExperiment = await Experiment.findOne({ _id: experimentId });
    if (!existingExperiment) {
      console.log("Threre is no experiment with this name");
      return new Response(
        JSON.stringify({
          message: "Threre is no experiment with this name",
        }),
        {
          status: 400,
        }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Iterations found",
        title: existingExperiment.title,
        description: existingExperiment.description,
        iterations: existingExperiment.iterations,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Error getting iteration",
      }),
      {
        status: 500,
      }
    );
  }
}
