import { buildEvidence } from "./evidence.js";
import { aiOutputSchema } from "./schemas.js";
import { getPrompt } from "./prompts.js";
import { generateWithProvider } from "./provider.js";
import { safetyGate } from "./guard.js";

export async function orchestrate({caseData,deterministicOutput,promptVersion="LAB_SUMMARY_V1"}){
 const prompt=getPrompt(promptVersion);
 if(!prompt)throw new Error("PROMPT_VERSION_NOT_FOUND");
 const evidence=buildEvidence(caseData);
 const generated=await generateWithProvider({
   evidence,
   patterns:deterministicOutput.patterns,
   prompt
 });
 const parsed=aiOutputSchema.safeParse(generated.output);
 if(!parsed.success){
   return{status:"REJECTED",reason:"SCHEMA_VALIDATION_FAILED",issues:parsed.error.issues,evidence,prompt};
 }
 const gate=safetyGate(parsed.data,evidence);
 if(!gate.passed){
   return{status:"REJECTED",reason:"SAFETY_GATE_FAILED",gate,evidence,prompt};
 }
 return{
   status:"COMPLETED",
   provider:generated.provider,
   model:generated.model,
   prompt:{name:promptVersion,version:prompt.version,constraints:prompt.constraints},
   evidence,
   output:parsed.data,
   gate
 };
}
