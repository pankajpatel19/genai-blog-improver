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
    });

    const response = await client.send(command);
    let text = response.output.message.content[0].text;

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      text = jsonMatch[0];
    }

    return JSON.parse(text);
  } catch (error) {
    console.error(" Bedrock Error: ", error);
    throw error;
  }
};
