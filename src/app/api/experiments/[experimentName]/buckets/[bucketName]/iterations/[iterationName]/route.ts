import dbConnect from "@/helper/dbConnect";
import { Experiment } from "@/types/database/Experiment";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  experimentName: string;
  bucketName: string;
  iterationName: string;
}

export async function GET(req: NextRequest, context: { params: Props }) {
  const { experimentName, bucketName, iterationName } = context.params;

  await dbConnect();

  try {
    const existingIteration = await Experiment.findOne({
      name: experimentName,
      "buckets.name": bucketName,
      "buckets.iterations.name": iterationName,
    }).then((experiment: any) => {
      return experiment.buckets[0].iterations.find(
        (iteration: any) => iteration.name === iterationName
      );
    });

    return NextResponse.json(
      {
        message: "Iteration found",
        name: existingIteration.name,
        timestamp: existingIteration.timestamp,
        environmentData: existingIteration.output.EnvironmentData,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error getting iteration",
      },
      { status: 500 }
    );
  }
}
