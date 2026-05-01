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
              text: `Improve the following blog content based on this prompt: "${prompt}"\n\nContent:\n${content}`,
            },
          ],
        },
      ],
      inferenceConfig: {
        maxTokens: 2000,
        temperature: 0.7,
      },
    });

    const response = await client.send(command);

    return response.output.message.content[0].text;
  } catch (error) {
    console.error("❌ Bedrock Error:", error);
    throw error;
  }
};
