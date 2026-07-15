import crypto from "crypto";
import { AiOutputSchema,validateEvidenceLinks,validateSafetyLanguage } from "./output.js";
import { runProvider,providerStatus } from "../provider.js";

const SYSTEM_PROMPT=`You are the bounded laboratory intelligence summarization component of AZEZ LAB AI.
You support qualified laboratory and healthcare professionals.
Never claim a confirmed diagnosis or disease.
Never alter measured values.
Use only the supplied evidence objects and pattern observations.
Every observation, differential consideration, and verification consideration must cite one or more supplied evidenceIds.
Separate pattern observations from possible associations and verification considerations.
Use cautious laboratory decision-support language.
If evidence is insufficient, state the limitation.
Return only the required structured output.`;

export async function executeGovernedAI({evidence,patterns,promptVersion="AZEZ-LAB-SYSTEM-V13"}){
 const allowedEvidenceIds=evidence.map(x=>x.evidenceId);
 const input={promptVersion,evidence,patterns,allowedEvidenceIds};
 const inputDigest=crypto.createHash("sha256").update(JSON.stringify(input)).digest("hex");
 const startedAt=new Date().toISOString();
 const result=await runProvider({systemPrompt:SYSTEM_PROMPT,input});
 const output=AiOutputSchema.parse(result.output);
 const evidenceGuard=validateEvidenceLinks(output,allowedEvidenceIds);
 if(!evidenceGuard.ok)throw Object.assign(new Error("AI_EVIDENCE_LINK_GUARD_FAILED"),{details:evidenceGuard});
 const safetyGuard=validateSafetyLanguage(output);
 if(!safetyGuard.ok)throw Object.assign(new Error("AI_SAFETY_LANGUAGE_GUARD_FAILED"),{details:safetyGuard});
 return{
  output,
  governance:{
   ...providerStatus(),...result.providerMetadata,promptVersion,inputDigest,
   evidenceCount:evidence.length,patternCount:patterns.length,
   evidenceGuard:"PASSED",safetyGuard:"PASSED",startedAt,completedAt:new Date().toISOString()
  }
 };
}
