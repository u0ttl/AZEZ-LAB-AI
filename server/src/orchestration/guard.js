import { evidenceMap } from "./evidence.js";

export function validateEvidenceLinks(output,evidence){
  const map=evidenceMap(evidence),errors=[];
  const groups=[
    ["observations",output.observations],
    ["possibleAssociations",output.possibleAssociations],
    ["verificationConsiderations",output.verificationConsiderations],
    ["criticalSignals",output.criticalSignals]
  ];
  for(const [group,items] of groups){
    for(const [index,item] of (items||[]).entries()){
      for(const id of item.evidenceIds||[]){
        if(!map[id])errors.push({code:"UNKNOWN_EVIDENCE_ID",group,index,evidenceId:id});
      }
    }
  }
  return{valid:errors.length===0,errors};
}

export function detectMeasuredFactMutation(output,evidence){
  const corpus=JSON.stringify(output);
  const suspicious=[];
  for(const e of evidence){
    if(e.valueText && corpus.includes(e.canonicalCode) && !corpus.includes(String(e.valueText))){
      suspicious.push({evidenceId:e.evidenceId,code:e.canonicalCode,reason:"CODE_REFERENCED_WITHOUT_SOURCE_VALUE_IN_OUTPUT_CORPUS"});
    }
  }
  return suspicious;
}

export function safetyGate(output,evidence){
  const linkCheck=validateEvidenceLinks(output,evidence);
  const mutations=detectMeasuredFactMutation(output,evidence);
  const safetyValid=output?.safety?.confirmedDiagnosis===false &&
    output?.safety?.professionalReviewRequired===true &&
    output?.safety?.measuredFactsMutable===false;
  return{
    passed:linkCheck.valid&&safetyValid,
    linkCheck,
    mutationSignals:mutations,
    safetyContractValid:safetyValid
  };
}
