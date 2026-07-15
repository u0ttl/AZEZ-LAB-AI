let prisma=null;
try{
 if(process.env.DATABASE_URL){
  const mod=await import("@prisma/client");
  prisma=new mod.PrismaClient();
  await prisma.$connect();
 }
}catch(e){console.warn("Prisma unavailable; memory repository active:",e.message);prisma=null}
const memory=new Map();
export const repository={
 mode:()=>prisma?"postgresql":"memory",
 async listCases(orgCode="DEMO"){
  if(!prisma)return[...memory.values()];
  return prisma.case.findMany({where:{organization:{code:orgCode}},include:{results:true},orderBy:{updatedAt:"desc"}});
 },
 async getCase(externalId,orgCode="DEMO"){
  if(!prisma)return memory.get(`${orgCode}:${externalId}`)||null;
  return prisma.case.findFirst({where:{externalId,organization:{code:orgCode}},include:{organization:true,results:true,analyses:{orderBy:{createdAt:"desc"},take:5}}});
 },
 async saveCase(data,orgCode="DEMO"){
  if(!prisma){const row={...data,organizationCode:orgCode};memory.set(`${orgCode}:${data.externalId}`,row);return row}
  const org=await prisma.organization.upsert({where:{code:orgCode},update:{},create:{code:orgCode,name:"AZEZ LAB Demo Organization"}});
  return prisma.case.create({data:{organizationId:org.id,externalId:data.externalId,displayName:data.displayName,specimen:data.specimen,status:"READY",results:{create:data.results.map(r=>({canonicalCode:r.canonicalCode,sourceCode:r.sourceCode,valueText:r.valueText,numericValue:r.numericValue,unit:r.unit,referenceLow:r.referenceLow,referenceHigh:r.referenceHigh,flag:r.flag,normalizationJson:r.normalizationJson}))}},include:{results:true}});
 },
 async saveAnalysis(c,output){
  if(!prisma)return {status:"COMPLETED",output};
  return prisma.analysis.create({data:{caseId:c.id,engine:output.engine.name,engineVersion:output.engine.version,status:"COMPLETED",measuredJson:output.measured,patternJson:output.patterns,associationJson:output.associations,verifyJson:output.verify,safetyJson:output.safety}});
 },
 async saveOrchestration(c,run){
  if(!prisma)return run;
  return prisma.orchestrationRun.create({data:{
   caseId:c.id,provider:run.provider||"none",model:run.model||"none",
   promptName:run.prompt?.name||"unknown",promptVersion:run.prompt?.version||"unknown",
   status:run.status,evidenceJson:run.evidence||[],outputJson:run.output||undefined,gateJson:run.gate||undefined
  }});
 },
 async audit(caseId,actor,action,metadata={}){
  if(!prisma)return;
  await prisma.auditEvent.create({data:{caseId,actor,action,metadata}});
 }
};