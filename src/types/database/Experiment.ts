import mongoose from "mongoose";
import { iterationSchema } from "./Iteration";

const bucketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  iterations: {
    type: [iterationSchema],
  },
  lastModified: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const experimentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  lastModified: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  buckets: {
    type: [bucketSchema],
  },
});

export const Experiment =
  mongoose.models.Experiment || mongoose.model("Experiment", experimentSchema);
