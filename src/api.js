const BASE=import.meta.env.VITE_API_URL||"http://localhost:8787";
export async function analyzeDemoCase(){return req("/api/cases/DEMO-0248/analyze",{method:"POST"})}
export async function health(){
 const r=await fetch(`${BASE}/api/health`);
 if(!r.ok)throw new Error("Core API unavailable");
 return r.json();
}
export async function ingestReport(file){
 const body=new FormData();body.append("report",file);
 const r=await fetch(`${BASE}/api/ingestion`,{method:"POST",body});
 const data=await r.json();if(!r.ok)throw new Error(data.error||"Ingestion failed");return data;
}

export async function orchestrateDemoCase(){return req("/api/cases/DEMO-0248/orchestrate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({promptVersion:"LAB_SUMMARY_V1"})})}

let TOKEN=sessionStorage.getItem("azez_demo_token")||"";
async function req(path,options={}){
 const r=await fetch(`${BASE}${path}`,{...options,headers:{...(options.headers||{}),...(TOKEN?{Authorization:`Bearer ${TOKEN}`}:{})}});
 const data=await r.json();if(!r.ok)throw new Error(data.error||data.message||"Request failed");return data;
}
export async function demoLogin(email="reviewer@demo.azez"){const data=await req("/api/auth/demo-login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})});TOKEN=data.token;sessionStorage.setItem("azez_demo_token",TOKEN);return data}
export async function workflowCase(){return req("/api/cases/DEMO-0248/workflow")}
export async function lockDemoCase(){return req("/api/cases/DEMO-0248/lock",{method:"POST"})}
export async function reviewDemoCase(decision,notes,finalOutput){return req("/api/cases/DEMO-0248/reviews",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({decision,notes,finalOutput})})}
export async function acknowledgeDemoSignal(signalKey,note){return req("/api/cases/DEMO-0248/critical-acknowledgments",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({signalKey,note})})}

export async function integrationDemo(){
 const hl7=`MSH|^~\\&|LAB|AZEZ|HIS|DEMO|202607141900||ORU^R01|MSG00001|P|2.5\rPID|1||P-0248||DEMO^CASE\rOBR|1|ORD-1|FILL-1|CBC^Complete Blood Count\rOBX|1|NM|HB^Hemoglobin||9.8|g/dL|12-16|L|||F\rOBX|2|NM|MCV^MCV||68|fL|80-100|L|||F\rOBX|3|NM|MCH^MCH||21|pg|27-33|L|||F\rOBX|4|NM|RDW^RDW||18.2|%|11.5-14.5|H|||F`;
 return req("/api/integration/hl7",{method:"POST",headers:{"Content-Type":"application/json","Idempotency-Key":"DEMO-HL7-MSG-00001"},body:JSON.stringify({message:hl7,sourceCode:"LIS-DEMO"})});
}
export async function integrationMessages(){return req("/api/integration/messages")}

export async function extractMedicalDocument(file){
 const body=new FormData();body.append("report",file);
 const r=await fetch(`${BASE}/api/document-intelligence/extract`,{method:"POST",body});
 const data=await r.json();if(!r.ok)throw new Error(data.message||data.error||"Document extraction failed");return data;
}

export async function aiProviderStatus(){return req("/api/ai/provider-status")}
export async function runRealAiAnalysis(){return req("/api/cases/DEMO-0248/ai-analysis",{method:"POST"})}

export async function knowledgeSummary(){return req("/api/knowledge/summary")}
export async function knowledgeTests(q=""){return req(`/api/knowledge/tests${q?`?q=${encodeURIComponent(q)}`:""}`)}
export async function convertLabValue(testCode,value,from,to){return req("/api/knowledge/convert",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({testCode,value,from,to})})}
