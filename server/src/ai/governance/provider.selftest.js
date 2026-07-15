import { AiOutputSchema,validateEvidenceLinks,validateSafetyLanguage } from "./output.js";
const good=AiOutputSchema.parse({
 summary:"The supplied laboratory evidence demonstrates an abnormal red-cell pattern requiring professional correlation.",
 observations:[{statement:"Reduced hemoglobin and MCV are present in the supplied evidence.",evidenceIds:["EV-1","EV-2"],category:"PATTERN_OBSERVATION"}],
 differentialConsiderations:[{consideration:"This pattern may occur in multiple clinical contexts.",evidenceIds:["EV-1","EV-2"]}],
 verificationConsiderations:[{action:"Correlate with laboratory history and verified supporting studies where appropriate.",evidenceIds:["EV-1"]}],
 limitations:["No clinical history was supplied."],
 safetyStatement:"This output is laboratory decision support and is not a confirmed diagnosis."
});
if(!validateEvidenceLinks(good,["EV-1","EV-2"]).ok)throw new Error("GOOD_EVIDENCE_REJECTED");
if(validateEvidenceLinks(good,["EV-1"]).ok)throw new Error("INVALID_EVIDENCE_ACCEPTED");
const unsafe={...good,safetyStatement:"The patient has iron deficiency anemia."};
if(validateSafetyLanguage(unsafe).ok)throw new Error("UNSAFE_LANGUAGE_ACCEPTED");
console.log("AI GOVERNANCE SELFTEST PASSED");
