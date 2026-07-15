import OpenAI from "openai";
import { env } from "../../config/env.js";
import { AiOutputSchema } from "../governance/output.js";

let client;
function getClient(){if(!client)client=new OpenAI({apiKey:env.OPENAI_API_KEY,timeout:env.AI_TIMEOUT_MS,maxRetries:2});return client}

export async function runOpenAI({systemPrompt,input}){
 const response=await getClient().responses.create({
  model:env.OPENAI_MODEL,
  input:[
   {role:"system",content:[{type:"input_text",text:systemPrompt}]},
   {role:"user",content:[{type:"input_text",text:JSON.stringify(input)}]}
  ],
  text:{format:{
   type:"json_schema",
   name:"azez_lab_ai_output",
   strict:true,
   schema:{
    type:"object",additionalProperties:false,
    properties:{
     summary:{type:"string"},
     observations:{type:"array",items:{type:"object",additionalProperties:false,properties:{statement:{type:"string"},evidenceIds:{type:"array",items:{type:"string"}},category:{type:"string",enum:["PATTERN_OBSERVATION","POSSIBLE_ASSOCIATION","VERIFICATION_CONSIDERATION"]}},required:["statement","evidenceIds","category"]}},
     differentialConsiderations:{type:"array",items:{type:"object",additionalProperties:false,properties:{consideration:{type:"string"},evidenceIds:{type:"array",items:{type:"string"}}},required:["consideration","evidenceIds"]}},
     verificationConsiderations:{type:"array",items:{type:"object",additionalProperties:false,properties:{action:{type:"string"},evidenceIds:{type:"array",items:{type:"string"}}},required:["action","evidenceIds"]}},
     limitations:{type:"array",items:{type:"string"}},
     safetyStatement:{type:"string"}
    },
    required:["summary","observations","differentialConsiderations","verificationConsiderations","limitations","safetyStatement"]
   }
  }},
  temperature:0.1
 });
 const raw=response.output_text;
 const parsed=AiOutputSchema.parse(JSON.parse(raw));
 return{
  output:parsed,
  providerMetadata:{provider:"openai",model:env.OPENAI_MODEL,responseId:response.id,usage:response.usage||null}
 };
}
