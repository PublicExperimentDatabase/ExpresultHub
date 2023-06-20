import dbConnect from "@/helper/dbConnect";
import { Experiment } from "@/types/database/Experiment";
import { z } from "zod";

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  const { experimentId, iterationIds } = z
    .object({
      experimentId: z.string(),
      iterationIds: z.array(z.string()),
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

    existingExperiment.iterations = existingExperiment.iterations.filter((iteration: any) => {
      return !iterationIds.includes(iteration._id.toString());
    });

    await existingExperiment.save();

    return new Response(
      JSON.stringify({
        message: "Iteration deleted",
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Error deleting experiment",
      }),
      {
        status: 500,
      }
    );
  }
}
