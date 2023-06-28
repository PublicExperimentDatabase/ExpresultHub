import { Experiment } from "@/types/database/Experiment";
import dbConnect from "@/helper/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

interface Props {
  experimentName: string;
}

export async function GET(req: NextRequest, context: { params: Props }) {
  const { experimentName } = context.params;

  await dbConnect();

  try {
    const existingExperiment = await Experiment.findOne({
      name: experimentName,
    });

    return NextResponse.json(
      {
        message: "Iterations found",
        name: existingExperiment.name,
        description: existingExperiment.description,
        buckets: existingExperiment.buckets,
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

export async function POST(req: Request, context: { params: Props }) {
  const body = await req.json();
  const { experimentName } = context.params;
  const { bucketName, description } = z
    .object({
      bucketName: z.string(),
      description: z.string().nullish(),
    })
    .parse(body);

  await dbConnect();

  try {
    const filter = {
      name: experimentName,
      "buckets.name": { $ne: bucketName },
    };

    const update = {
      $push: {
        buckets: {
          name: bucketName,
          description: description,
          iterations: [],
          lastModified: new Date(),
          created: new Date(),
        },
      },
    };

    const options = {
      new: true,
    };

    const updatedExperiment = await Experiment.findOneAndUpdate(filter, update, options);
    if (!updatedExperiment) {
      console.log("There is no experiment with the provided names or bucket already exists");
      return NextResponse.json(
        {
          message: "There is no experiment with the provided names or bucket already exists",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Bucket created",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error creating Bucket",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, context: { params: Props }) {
  const body = await req.json();
  const { experimentName } = context.params;
  const { bucketNames } = z
    .object({
      bucketNames: z.array(z.string()),
    })
    .parse(body);

  await dbConnect();
  try {
    await Experiment.findOneAndUpdate(
      {
        name: experimentName,
      },
      {
        $pull: {
          buckets: {
            name: { $in: bucketNames },
          },
        },
      },
      {
        new: true,
      }
    ).then((experiment: any) => experiment);

    return NextResponse.json(
      {
        message: "Bucket deleted",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error deleting Bucket",
      },
      { status: 500 }
    );
  }
}
