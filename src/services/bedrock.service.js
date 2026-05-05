import { agentClient, client } from "../config/aws.js";
import { ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import { RetrieveCommand } from "@aws-sdk/client-bedrock-agent-runtime";
import { responseValidation } from "../utils/response.validation.js";
import { KB_ID } from "../utils/env.js";

const retrieveContext = async (query) => {
  try {
    const command = new RetrieveCommand({
      knowledgeBaseId: KB_ID,
      retrievalQuery: {
        text: query,
      },
      retrieverConfiguration: {
        vectorSearchConfiguration: {
          numberOfResults: 5,
        },
      },
    });
    const response = await agentClient.send(command);

    if (!response?.retrievalResults || response.retrievalResults.length === 0) {
      console.log("No relevant context found in Knowledge Base.");
      return "";
    }

    const combinedContext = response.retrievalResults
      .map((result) => result.content.text)
      .join("\n\n---\n\n");

    return combinedContext;
  } catch (error) {
    console.error("Error retrieving context from KB:", error);
    return "";
  }
};

export const improveBlog = async (content, prompt) => {
  try {
    let context = await retrieveContext(
      `Please find more information about the topic: ${prompt} based on the content: ${content}`,
    );
    let result = await callBedrock(content, prompt, context);
    return result;
  } catch (error) {
    console.log("Error in improveBlog: ", error);
    throw error;
  }
};

async function callBedrock(content, prompt, context) {
  try {
    const command = new ConverseCommand({
      modelId: "amazon.nova-lite-v1:0",
      messages: [
        {
          role: "user",
          content: [
            {
              text: `Task: Improve the blog content below. Use the provided Knowledge Base Context to make the blog more accurate and detailed.\n\nKnowledge Base Context:\n${context || "No additional context available."}\n\nPrompt: ${prompt}\n\nContent: ${content}\n\nReturn the result strictly as a JSON object with exactly these two keys: "title" and "description". DO NOT include any conversational text, explanations, or triple backticks. Example format: {"title": "...","description": "..."}`,
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
    let result = responseValidation.parse(text);

    return result;
  } catch (error) {
    console.error(" Bedrock Error: ", error);
    throw error;
  }
}
