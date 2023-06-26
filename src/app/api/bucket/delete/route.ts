import dbConnect from "@/helper/dbConnect";
import { Experiment } from "@/types/database/Experiment";
import { z } from "zod";

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  const { experimentId, bucketIds } = z
    .object({
      experimentId: z.string(),
      bucketIds: z.array(z.string()),
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

    existingExperiment.buckets = existingExperiment.buckets.filter((bucket: any) => {
      return !bucketIds.includes(bucket._id.toString());
    });

    await existingExperiment.save();

    return new Response(
      JSON.stringify({
        message: "Bucket deleted",
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Error deleting bucket",
      }),
      {
        status: 500,
      }
    );
  }
}
