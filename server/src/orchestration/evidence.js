import crypto from "crypto";

export function buildEvidence(caseData){
  return caseData.results.map((r,index)=>({
    evidenceId:`EV-${String(index+1).padStart(4,"0")}`,
    type:"MEASURED_LAB_RESULT",
    canonicalCode:r.canonicalCode||r.testCode,
    valueText:r.valueText,
    numericValue:r.numericValue,
    unit:r.unit||null,
    flag:r.flag,
    referenceLow:r.referenceLow??null,
    referenceHigh:r.referenceHigh??null,
    source:r.source||"INGESTED_OR_MANUAL",
    digest:crypto.createHash("sha256")
      .update(JSON.stringify([r.canonicalCode||r.testCode,r.valueText,r.unit,r.flag]))
      .digest("hex").slice(0,16)
  }));
}

export function evidenceMap(evidence){
  return Object.fromEntries(evidence.map(e=>[e.evidenceId,e]));
}
