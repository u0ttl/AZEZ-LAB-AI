const proposals=[];
export function proposeKnowledgeChange({type,targetCode,payload,reason,proposedBy}){
 const p={id:`KCH-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,type,targetCode,payload,reason,proposedBy,status:"PROPOSED",createdAt:new Date().toISOString(),reviews:[]};
 proposals.push(p);return p;
}
export function reviewKnowledgeChange(id,{decision,reviewer,note}){
 const p=proposals.find(x=>x.id===id);if(!p)return null;
 if(!["APPROVED","REJECTED"].includes(decision))throw new Error("INVALID_KNOWLEDGE_REVIEW_DECISION");
 p.reviews.push({decision,reviewer,note:note||null,at:new Date().toISOString()});p.status=decision;return p;
}
export function listKnowledgeChanges(){return proposals}
