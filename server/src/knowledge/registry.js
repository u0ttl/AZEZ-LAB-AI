import catalog from "./catalog/core.json" with { type:"json" };

const byCode=new Map(),aliasMap=new Map(),disciplines=new Map(catalog.disciplines.map(x=>[x.code,x]));
for(const test of catalog.tests){
 byCode.set(test.code,test);
 for(const key of [test.code,test.name,...(test.aliases||[])])aliasMap.set(normalize(key),test.code);
}
function normalize(v){return String(v||"").trim().toUpperCase().replace(/[._-]+/g," ").replace(/\s+/g," ")}
export function resolveKnowledgeTest(value){
 const code=aliasMap.get(normalize(value));return code?byCode.get(code):null;
}
export function getKnowledgeTest(code){return byCode.get(String(code||"").toUpperCase())||null}
export function listKnowledgeTests({discipline,q}={}){
 let rows=[...byCode.values()];
 if(discipline)rows=rows.filter(x=>x.discipline===discipline);
 if(q){const n=normalize(q);rows=rows.filter(x=>[x.code,x.name,...x.aliases].some(v=>normalize(v).includes(n)))}
 return rows;
}
export function knowledgeSummary(){
 return{version:catalog.version,status:catalog.status,testCount:catalog.tests.length,disciplineCount:catalog.disciplines.length,conversionCount:catalog.conversions.length,disciplines:[...disciplines.values()]};
}
export function convertKnowledgeValue(testCode,value,from,to){
 const n=Number(value);if(!Number.isFinite(n))return{ok:false,error:"NUMERIC_VALUE_REQUIRED"};
 if(from===to)return{ok:true,value:n,from,to,factor:1};
 const rule=catalog.conversions.find(x=>x.testCode===testCode&&x.from===from&&x.to===to);
 if(!rule)return{ok:false,error:"CONVERSION_NOT_GOVERNED",testCode,from,to};
 return{ok:true,value:Number((n*rule.factor).toPrecision(12)),from,to,factor:rule.factor,ruleVersion:catalog.version};
}
export { catalog };
