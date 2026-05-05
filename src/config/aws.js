import { BedrockAgentRuntimeClient } from "@aws-sdk/client-bedrock-agent-runtime";
import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";
import {
  AGENT_REGION,
  AWS_ACCESS_KEY,
  AWS_REGION,
  AWS_SECRET_KEY,
} from "../utils/env.js";

const config = {
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
};

const agentconfig = {
  region: AGENT_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
};
export const client = new BedrockRuntimeClient(config);

export const agentClient = new BedrockAgentRuntimeClient(agentconfig);
