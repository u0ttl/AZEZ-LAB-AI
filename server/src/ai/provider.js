import { env } from "../config/env.js";
import { runOpenAI } from "./providers/openai.js";

export async function runProvider(args){
 if(env.AI_PROVIDER==="openai")return runOpenAI(args);
 throw new Error("REAL_AI_PROVIDER_NOT_CONFIGURED");
}
export function providerStatus(){return{provider:env.AI_PROVIDER,model:env.AI_PROVIDER==="openai"?env.OPENAI_MODEL:"mock",realProviderConfigured:env.AI_PROVIDER!=="mock"}}
