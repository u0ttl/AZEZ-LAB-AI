import "dotenv/config";
import { Worker } from "bullmq";
import { redis,connectInfra,prisma } from "../infra/clients.js";
import { logger } from "../observability/logger.js";

await connectInfra();

const worker=new Worker("azez-lab-jobs",async job=>{
 logger.info({jobId:job.id,jobName:job.name},"worker job started");
 if(job.name==="INGESTION_POSTPROCESS"){
   await prisma.ingestionJob.update({
     where:{id:job.data.ingestionJobId},
     data:{status:"NEEDS_VERIFICATION"}
   });
   return{ok:true};
 }
 if(job.name==="AUDIT_HEARTBEAT")return{ok:true,at:new Date().toISOString()};
 throw new Error(`UNKNOWN_JOB_${job.name}`);
},{connection:redis,concurrency:4});

worker.on("completed",(job,result)=>logger.info({jobId:job.id,result},"worker job completed"));
worker.on("failed",(job,error)=>logger.error({jobId:job?.id,error:error.message},"worker job failed"));

async function shutdown(signal){
 logger.info({signal},"worker shutting down");
 await worker.close();await redis.quit();await prisma.$disconnect();process.exit(0);
}
process.on("SIGTERM",()=>shutdown("SIGTERM"));
process.on("SIGINT",()=>shutdown("SIGINT"));
