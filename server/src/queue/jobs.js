import { Queue } from "bullmq";
import { redis } from "../infra/clients.js";
export const labQueue=new Queue("azez-lab-jobs",{connection:redis});
export async function enqueueJob(name,data,opts={}){
 return labQueue.add(name,data,{
   attempts:3,
   backoff:{type:"exponential",delay:1500},
   removeOnComplete:1000,
   removeOnFail:5000,
   ...opts
 });
}
