import express from "express";
import { createBlog, processBlog } from "../controllers/blog.controller.js";

const router = express.Router();

router.post("/create", createBlog);
router.post("/improve", processBlog);

export default router;
