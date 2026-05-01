import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    content: String,
    prompt: String,
    processed: { type: Boolean, default: false },
    improvedContent: String,
  },
  { timestamps: true },
);

export default mongoose.model("Blog", blogSchema);
