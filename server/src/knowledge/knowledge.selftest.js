import { resolveKnowledgeTest,convertKnowledgeValue,knowledgeSummary } from "./registry.js";
if(resolveKnowledgeTest("HB")?.code!=="HGB")throw new Error("HB_ALIAS_FAILED");
if(resolveKnowledgeTest("SGPT")?.code!=="ALT")throw new Error("SGPT_ALIAS_FAILED");
const glucose=convertKnowledgeValue("GLU",180,"mg/dL","mmol/L");
if(!glucose.ok||Math.abs(glucose.value-9.99)>.02)throw new Error("GLU_CONVERSION_FAILED");
const s=knowledgeSummary();if(s.testCount<30||s.disciplineCount<8)throw new Error("CATALOG_SUMMARY_FAILED");
console.log("LAB KNOWLEDGE SELFTEST PASSED",JSON.stringify(s));
