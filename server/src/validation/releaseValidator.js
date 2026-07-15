import { spawn } from "node:child_process";
const suites=[
 ["document-parser","npm",["run","test:document-parser"]],
 ["knowledge","npm",["run","test:knowledge"]],
 ["tenant-isolation","npm",["run","test:tenant-isolation"]],
 ["ai-guard","npm",["run","test:ai-guard"]],
 ["validation-metrics","npm",["run","test:validation-metrics"]]
];
function run(name,cmd,args){
 return new Promise(resolve=>{
  const p=spawn(cmd,args,{shell:process.platform==="win32",env:process.env});
  let stdout="",stderr="";
  p.stdout.on("data",d=>stdout+=d);p.stderr.on("data",d=>stderr+=d);
  p.on("close",code=>resolve({name,status:code===0?"PASSED":"FAILED",code,stdout:stdout.trim().slice(-2000),stderr:stderr.trim().slice(-2000)}));
 });
}
export async function validateRelease(){
 const results=[];
 for(const s of suites)results.push(await run(...s));
 const passed=results.filter(x=>x.status==="PASSED").length;
 return{release:"AZEZ-LAB-AI-V16",status:passed===results.length?"PASSED":"FAILED",passed,total:results.length,results,completedAt:new Date().toISOString()};
}
if(process.argv[1]?.endsWith("releaseValidator.js")){
 const result=await validateRelease();console.log(JSON.stringify(result,null,2));process.exit(result.status==="PASSED"?0:1);
}
