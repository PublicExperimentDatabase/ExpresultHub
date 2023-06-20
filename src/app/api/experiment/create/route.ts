import { Experiment } from "@/types/database/Experiment";
import dbConnect from "@/helper/dbConnect";
import { z } from "zod";
import fs from "fs";

export async function POST(req: Request, res: Response) {
  const body = await req.json();

  const { title, description } = z
    .object({ title: z.string(), description: z.string().nullish() })
    .parse(body);

  await dbConnect();

  // Check if an experiment with the same name already exists
  const existingExperiment = await Experiment.findOne({ title });
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

  // create folder for experiment
  fs.mkdir(`${process.env.Local_Path}/${title}`, { recursive: true }, (err) => {
    if (err) {
      console.error(err);
    }
  });

  try {
    const newExperiment = Experiment.create({
      title,
      description,
      // members: ["owner"],
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
