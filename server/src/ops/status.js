import os from "node:os";
export function operationalStatus({infraState,provider,knowledge}){
 return{
  service:"AZEZ LAB AI",
  release:"V17-DEPLOYMENT-CANDIDATE",
  uptimeSeconds:Math.floor(process.uptime()),
  node:process.version,
  platform:process.platform,
  memory:{rss:process.memoryUsage().rss,heapUsed:process.memoryUsage().heapUsed},
  host:{loadAverage:os.loadavg()},
  infrastructure:infraState,
  ai:provider,
  knowledge,
  timestamp:new Date().toISOString()
 };
}
