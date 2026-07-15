export const TESTS=[
 {code:"HGB",name:"Hemoglobin",discipline:"HEMATOLOGY",unit:"g/dL",aliases:["HB","HEMOGLOBIN","HGB"]},
 {code:"MCV",name:"Mean Corpuscular Volume",discipline:"HEMATOLOGY",unit:"fL",aliases:["MCV"]},
 {code:"MCH",name:"Mean Corpuscular Hemoglobin",discipline:"HEMATOLOGY",unit:"pg",aliases:["MCH"]},
 {code:"RDW",name:"Red Cell Distribution Width",discipline:"HEMATOLOGY",unit:"%",aliases:["RDW","RDW-CV"]},
 {code:"WBC",name:"White Blood Cell Count",discipline:"HEMATOLOGY",unit:"×10⁹/L",aliases:["WBC","WHITE BLOOD CELLS"]},
 {code:"PLT",name:"Platelet Count",discipline:"HEMATOLOGY",unit:"×10⁹/L",aliases:["PLT","PLATELETS"]}
];
const aliases=new Map(TESTS.flatMap(t=>t.aliases.map(a=>[a.toUpperCase(),t])));
export function resolveTest(code){return aliases.get(String(code).trim().toUpperCase())||null}
export function registryView(){return TESTS.map(({aliases,...t})=>({...t,aliases}))}