import { Experiment } from "@/types/database/Experiment";
import dbConnect from "@/helper/dbConnect";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  experimentName: string;
  bucketName: string;
}

export async function GET(req: NextRequest, context: { params: Props }) {
  const { experimentName, bucketName } = context.params;

  await dbConnect();

  try {
    const existingBucket = await Experiment.findOne(
      {
        name: experimentName,
        "buckets.name": bucketName,
      },
      { "buckets.$": 1 }
    ).then((experiment: any) => experiment.buckets[0]);

    return NextResponse.json(
      {
        message: "Iterations found",
        name: existingBucket.name,
        description: existingBucket.description,
        iterations: existingBucket.iterations,
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

export async function POST(req: NextRequest, context: { params: Props }) {
  const body = await req.json();
  const { experimentName, bucketName } = context.params;

  const { iterationName, description } = z
    .object({
      iterationName: z.string(),
      description: z.string().nullish(),
    })
    .parse(body);

  await dbConnect();

  try {
    const filter = {
      name: experimentName,
      "buckets.name": bucketName,
      "buckets.iterations.name": { $ne: iterationName }, // check duplicate
    };

    const update = {
      $push: {
        "buckets.$[bucket].iterations": {
          name: iterationName,
          description: description,
        },
      },
    };

    const options = {
      arrayFilters: [{ "bucket.name": bucketName }],
      new: true,
    };

    const updatedExperiment = await Experiment.findOneAndUpdate(filter, update, options);

    if (!updatedExperiment) {
      console.log(
        "There is no experiment or bucket with the provided names or iteration already exists"
      );
      return NextResponse.json(
        {
          message:
            "There is no experiment or bucket with the provided names or iteration already exists",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Iteration created",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating iteration:", error);
    return NextResponse.json(
      {
        message: "Error creating iteration",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, context: { params: Props }) {
  const body = await req.json();
  const { experimentName, bucketName } = context.params;
  const { iterationNames } = z
    .object({
      iterationNames: z.array(z.string()),
    })
    .parse(body);

  await dbConnect();
  try {
    await Experiment.findOneAndUpdate(
      {
        name: experimentName,
        "buckets.name": bucketName,
      },
      {
        $pull: {
          "buckets.$[bucketElem].iterations": {
            name: { $in: iterationNames },
          },
        },
      },
      {
        arrayFilters: [{ "bucketElem.name": bucketName }],
        new: true,
      }
    ).then((experiment: any) => experiment);

    return NextResponse.json(
      {
        message: "Iteration deleted",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error deleting iteration",
      },
      { status: 500 }
    );
  }
}
