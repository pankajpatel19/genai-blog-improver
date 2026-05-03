import client from "../config/aws.js";
import { ConverseCommand } from "@aws-sdk/client-bedrock-runtime";

export const improveBlog = async (content, prompt) => {
  try {
    const command = new ConverseCommand({
      modelId: "amazon.nova-lite-v1:0",
      messages: [
        {
          role: "user",
          content: [
            {
              text: `Task: Improve the blog content below. Prompt: ${prompt} Content: ${content} Return the result strictly as a JSON object with exactly these two keys: "title" and "description". DO NOT include any conversational text, explanations, or triple backticks. Example format: {"title": "...","description": "..."}`,
            },
          ],
        },
      ],
      inferenceConfig: {
        maxTokens: 2000,
        temperature: 0.7,
      },
      toolConfig: {
        toolChoice: {
          tool: { name: "BlogImprovement" },
        },
        tools: [
          {
            toolSpec: {
              name: "BlogImprovement",
              description: "Returns improved blog title and description",
              inputSchema: {
                json: {
                  type: "object",
                  properties: {
                    title: {
                      type: "string",
                      description: "Improved blog title",
                    },
                    description: {
                      type: "string",
                      description: "Improved blog content",
                    },
                  },
                  required: ["title", "description"],
                },
              },
            },
          },
        ],
      },
    });

    const response = await client.send(command);
    let text = response?.output?.message?.content[0]?.toolUse?.input;

    return text;
  } catch (error) {
    console.error(" Bedrock Error: ", error);
    throw error;
  }
};
