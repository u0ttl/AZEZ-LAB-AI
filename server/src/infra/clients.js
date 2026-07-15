import { PrismaClient } from "@prisma/client";
import IORedis from "ioredis";
import { env } from "../config/env.js";
import { logger } from "../observability/logger.js";

export const prisma=new PrismaClient();
export const redis=new IORedis(env.REDIS_URL,{maxRetriesPerRequest:null,lazyConnect:true});

export async function connectInfra(){
  const state={postgres:false,redis:false,errors:[]};
  try{await prisma.$queryRaw`SELECT 1`;state.postgres=true}catch(e){state.errors.push({service:"postgres",message:e.message})}
  try{if(redis.status==="wait")await redis.connect();await redis.ping();state.redis=true}catch(e){state.errors.push({service:"redis",message:e.message})}
  if(env.REQUIRE_DURABLE_INFRA && (!state.postgres||!state.redis)){
    logger.fatal({state},"Durable infrastructure is required but unavailable");
    throw new Error("DURABLE_INFRA_UNAVAILABLE");
  }
  return state;
}
