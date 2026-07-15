import fs from "node:fs/promises";
import path from "node:path";
import { env } from "../config/env.js";
import { connectInfra } from "../infra/clients.js";

async function storageCheck(){
 try{
  const dir=path.resolve(env.STORAGE_ROOT);await fs.mkdir(dir,{recursive:true});
  const f=path.join(dir,`.preflight-${process.pid}`);await fs.writeFile(f,"ok");await fs.unlink(f);
  return{ok:true,path:dir};
 }catch(e){return{ok:false,error:e.message}}
}
export async function runPreflight(){
 const checks=[];
 checks.push({name:"JWT_SECRET",ok:env.NODE_ENV!=="production"||(!env.JWT_SECRET.includes("development-only")&&env.JWT_SECRET.length>=32)});
 checks.push({name:"AI_PROVIDER_CONFIG",ok:env.AI_PROVIDER!=="openai"||Boolean(env.OPENAI_API_KEY)});
 const storage=await storageCheck();checks.push({name:"STORAGE_WRITABLE",...storage});
 let infra;
 try{infra=await connectInfra()}catch(e){infra={postgres:false,redis:false,errors:[{message:e.message}]}}
 checks.push({name:"POSTGRESQL",ok:infra.postgres,details:infra.errors?.filter(x=>x.service==="postgres")});
 checks.push({name:"REDIS",ok:infra.redis,details:infra.errors?.filter(x=>x.service==="redis")});
 const passed=checks.filter(x=>x.ok).length;
 return{release:"AZEZ-LAB-AI-V17",status:passed===checks.length?"READY":"NOT_READY",passed,total:checks.length,checks,at:new Date().toISOString()};
}
if(process.argv[1]?.endsWith("preflight.js")){
 const x=await runPreflight();console.log(JSON.stringify(x,null,2));process.exit(x.status==="READY"?0:1);
}
