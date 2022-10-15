import dotenv from "dotenv";

dotenv.config();

export const envVars = {
    "port": process.env.PORT,
    "workflowToken": process.env.WORKFLOW_TOKEN,
    "workflowSecret": process.env.WORKFLOW_SECRET,
    "journeysToken": process.env.JOURNEYS_TOKEN
};