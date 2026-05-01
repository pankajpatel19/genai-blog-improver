import Blog from "../model/blog.model.js";
import { improveBlog } from "../services/bedrock.service.js";

export const createBlog = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const blog = await Blog.create({ content });

    res.status(201).json(blog);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const processBlog = async (req, res) => {
  try {
    const { id, prompt } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Blog ID is required" });
    }

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.processed) {
      return res.status(400).json({ message: "Blog already processed" });
    }

    const improved = await improveBlog(blog.content, prompt);

    blog.improvedContent = improved;
    blog.processed = true;

    await blog.save();

    res.json({ improvedContent: blog.improvedContent });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
