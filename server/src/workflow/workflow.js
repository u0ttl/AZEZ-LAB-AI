const transitions={
 DRAFT:["READY"],READY:["IN_REVIEW"],IN_REVIEW:["REVIEWED","READY"],REVIEWED:["ARCHIVED"],ARCHIVED:[]
};
export function canTransition(from,to){return(transitions[from]||[]).includes(to)}
export function transitionCase(c,to){
 if(!canTransition(c.status||"DRAFT",to))return{ok:false,error:"INVALID_WORKFLOW_TRANSITION",from:c.status||"DRAFT",to};
 return{ok:true,case:{...c,status:to,updatedAt:new Date().toISOString()}};
}
export function computeDiff(source,final){
 const a=JSON.stringify(source??null,null,2).split("\n"),b=JSON.stringify(final??null,null,2).split("\n");
 const max=Math.max(a.length,b.length),changes=[];
 for(let i=0;i<max;i++)if(a[i]!==b[i])changes.push({line:i+1,before:a[i]??null,after:b[i]??null});
 return{changed:changes.length>0,changeCount:changes.length,changes:changes.slice(0,200)};
}
