import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    content: String,
    prompt: String,
    processed: { type: Boolean, default: false },
    title: { type: String, default: "" },
    improvedContent: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("Blog", blogSchema);
