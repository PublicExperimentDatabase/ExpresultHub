import { Experiment } from "@/types/database/Experiment";
import dbConnect from "@/helper/dbConnect";
import { z } from "zod";
import fs from "fs";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const dbExperiments = await Experiment.find(
      {},
      { name: 1, description: 1, lastModified: 1, createdAt: 1 }
    );

    return new Response(
      JSON.stringify({
        message: "Experiments found",
        experiments: dbExperiments,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Error getting experiment",
      }),
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { name, description } = z
    .object({ name: z.string(), description: z.string().nullish() })
    .parse(body);

  await dbConnect();

  // Check if an experiment with the same name already exists
  const existingExperiment = await Experiment.findOne({ name });
  if (existingExperiment) {
    console.log("Experiment with the same name already exists");
    return new Response(
      JSON.stringify({
        message: "Experiment with the same name already exists",
      }),
      {
        status: 409,
      }
    );
  }

  // // create folder for experiment
  // fs.mkdir(`${process.env.Local_Path}/${name}`, { recursive: true }, (err) => {
  //   if (err) {
  //     console.error(err);
  //   }
  // });

  try {
    const newExperiment = Experiment.create({
      name,
      description,
    });

    return new Response(
      JSON.stringify({
        message: "Experiment created",
        experiment: newExperiment,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Error creating experiment",
      }),
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { names } = z.object({ names: z.array(z.string()) }).parse(body);

  await dbConnect();
  try {
    await Experiment.deleteMany({ name: { $in: names } });
    return new Response(
      JSON.stringify({
        message: "Experiment deleted",
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
