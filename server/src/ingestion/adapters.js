import{parse}from"csv-parse/sync";import XLSX from"xlsx";
const aliases={testCode:["test","testcode","test_code","code","analyte"],valueText:["value","result","valuetext","result_value"],unit:["unit","units"]};
function pick(row,names){const keys=Object.keys(row);const k=keys.find(x=>names.includes(x.toLowerCase().replace(/\s+/g,"")));return k?row[k]:undefined}
function rowsToFields(rows,adapter){
 return rows.map((row,i)=>({rowIndex:i+1,sourceTestCode:String(pick(row,aliases.testCode)||"").trim(),sourceValue:String(pick(row,aliases.valueText)||"").trim(),sourceUnit:String(pick(row,aliases.unit)||"").trim()||null,adapter,provenance:{adapter,rowIndex:i+1,sourceColumns:Object.keys(row)}})).filter(x=>x.sourceTestCode||x.sourceValue)
}
export function extractTabular(file,sourceType){
 if(sourceType==="csv"){
  const text=file.buffer.toString("utf8").replace(/^\uFEFF/,"");
  const rows=parse(text,{columns:true,skip_empty_lines:true,trim:true,relax_column_count:true});
  return{adapter:"CSV_HEADER_ADAPTER_V1",fields:rowsToFields(rows,"CSV_HEADER_ADAPTER_V1")};
 }
 if(sourceType==="xlsx"){
  const wb=XLSX.read(file.buffer,{type:"buffer",cellDates:false});
  const sheet=wb.Sheets[wb.SheetNames[0]];
  const rows=XLSX.utils.sheet_to_json(sheet,{defval:""});
  return{adapter:"XLSX_FIRST_SHEET_ADAPTER_V1",sheet:wb.SheetNames[0],fields:rowsToFields(rows,"XLSX_FIRST_SHEET_ADAPTER_V1")};
 }
 return null;
}
export function stageUnstructured(sourceType){
 return{adapter:sourceType==="pdf"?"PDF_OCR_PENDING":"IMAGE_OCR_PENDING",fields:[],requiresOcr:true,message:"File accepted into the ingestion boundary. OCR is not executed by V7; human-verification/OCR adapter integration is required."}
}