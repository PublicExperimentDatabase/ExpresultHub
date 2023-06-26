import dbConnect from "@/helper/dbConnect";
import { Experiment } from "@/types/database/Experiment";
import { z } from "zod";

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  const { experimentId, bucketId, iterationIds } = z
    .object({
      experimentId: z.string(),
      bucketId: z.string(),
      iterationIds: z.array(z.string()),
    })
    .parse(body);

  console.log(experimentId, bucketId, iterationIds);

  await dbConnect();
  try {
    const updatedExperiment = await Experiment.findOneAndUpdate(
      {
        _id: experimentId,
        "buckets._id": bucketId,
      },
      {
        $pull: {
          "buckets.$[bucketElem].iterations": {
            _id: { $in: iterationIds },
          },
        },
      },
      {
        arrayFilters: [{ "bucketElem._id": bucketId }],
        new: true,
      }
    ).then((experiment: any) => experiment);
    console.log(updatedExperiment);

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
