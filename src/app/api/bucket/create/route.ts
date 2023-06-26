import { Experiment } from "@/types/database/Experiment";
import dbConnect from "@/helper/dbConnect";
import { z } from "zod";
import fs from "fs";

export async function POST(req: Request, res: Response) {
  const body = await req.json();

  const { experimentTitle, bucketTitle, description } = z
    .object({
      experimentTitle: z.string(),
      bucketTitle: z.string(),
      description: z.string().nullish(),
    })
    .parse(body);

  await dbConnect();

  // Check if there is an experiment with the same name
  const existingExperiment = await Experiment.findOne({ title: experimentTitle });
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

  // Check if an iteration with the same name already exists in this experiment
  const existingBucket = existingExperiment.buckets.find(
    (bucket: any) => bucket.title === bucketTitle
  );

  if (existingBucket) {
    console.log("Bucket with the same name already exists");
    return new Response(
      JSON.stringify({
        message: "Bucket with the same name already exists",
      }),
      {
        status: 409,
      }
    );
  }

  // // create folder for iteration
  // fs.mkdir(
  //   `${process.env.Local_Path}/${experimentTitle}/${bucketTitle}`,
  //   { recursive: true },
  //   (err) => {
  //     if (err) {
  //       console.error(err);
  //     }
  //   }
  // );

  try {
    const newBucket = {
      title: bucketTitle,
      description: description,
      iterations: [],
      lastModified: new Date(),
      created: new Date(),
    };
    existingExperiment.buckets.push(newBucket);
    await existingExperiment.save();
    return new Response(
      JSON.stringify({
        message: "Bucket created",
        bucket: newBucket,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Error creating Bucket",
      }),
      {
        status: 500,
      }
    );
  }
}
