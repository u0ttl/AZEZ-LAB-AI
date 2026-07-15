import { prisma } from "../infra/clients.js";
export const durableIngestionStore={
 async create(data){
  return prisma.ingestionJob.create({data:{
   caseId:data.caseId||null,originalName:data.originalName,objectKey:data.objectKey||null,
   mimeType:data.mimeType,sizeBytes:data.sizeBytes,sha256:data.sha256,status:data.status,
   adapter:data.adapter||null,sourceType:data.sourceType||null,
   extractionJson:{fields:data.fields||[],verificationQueue:data.verificationQueue||[],documentInspection:data.documentInspection||null,message:data.message||null}
  }});
 },
 async get(id){return prisma.ingestionJob.findUnique({where:{id}})},
 async list(){return prisma.ingestionJob.findMany({orderBy:{createdAt:"desc"},take:100})},
 async update(id,patch){return prisma.ingestionJob.update({where:{id},data:patch})}
};
