export function parseHL7v2(raw){
 const text=String(raw||"").replace(/\r\n/g,"\r").replace(/\n/g,"\r").trim();
 const segments=text.split("\r").filter(Boolean).map((line,index)=>{
  const fields=line.split("|");return{name:fields[0],fields,index:index+1,raw:line}
 });
 const get=name=>segments.filter(s=>s.name===name);
 const msh=get("MSH")[0],pid=get("PID")[0],obr=get("OBR")[0],obx=get("OBX");
 if(!msh)throw new Error("HL7_MSH_REQUIRED");
 return{
  protocol:"HL7_V2",
  messageType:msh.fields[8]||null,
  messageControlId:msh.fields[9]||null,
  sendingApplication:msh.fields[2]||null,
  sendingFacility:msh.fields[3]||null,
  patient:{externalId:pid?.fields[3]||null,displayName:(pid?.fields[5]||"").replace(/\^/g," ").trim()||null},
  order:{placerOrder:obr?.fields[2]||null,fillerOrder:obr?.fields[3]||null,serviceId:obr?.fields[4]||null},
  observations:obx.map(s=>({
   setId:s.fields[1]||null,valueType:s.fields[2]||null,
   sourceTestCode:(s.fields[3]||"").split("^")[0],
   sourceTestName:(s.fields[3]||"").split("^")[1]||null,
   valueText:s.fields[5]||"",
   unit:(s.fields[6]||"").split("^")[0]||null,
   sourceReference:s.fields[7]||null,
   abnormalFlag:s.fields[8]||null,
   resultStatus:s.fields[11]||null,
   provenance:{segment:"OBX",segmentIndex:s.index,rawFieldMap:{identifier:3,value:5,unit:6,reference:7,flag:8,status:11}}
  })),
  segmentCount:segments.length
 };
}