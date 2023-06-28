import mongoose from "mongoose";
import { environmentDataSchema } from "./EnvironmentData";

export const iterationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  timestamp: {
    startTime: {
      type: Date,
    },
    stopTime: {
      type: Date,
    },
  },
  input: {
    configuration: {
      type: Map,
      of: mongoose.Schema.Types.ObjectId,
    },
    codeHash: {
      type: String,
    },
  },
  output: {
    dataHash: {
      type: String,
    },
    EnvironmentData: {
      type: [environmentDataSchema],
    },
  },
});

// export const Iteration = mongoose.models.Iteration || mongoose.model("Iteration", iterationSchema);
