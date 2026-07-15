export const CONNECTOR_CONTRACTS={
 LIS_PUSH_V1:{direction:"INBOUND",protocols:["HL7_V2","FHIR_R4"],requires:["organizationCode","sourceCode","idempotencyKey"],guarantees:["PAYLOAD_HASH","DUPLICATE_GUARD","MAPPING_STATUS","AUDITABLE_MESSAGE_STATE"]},
 ANALYZER_GATEWAY_V1:{direction:"INBOUND",protocols:["HL7_V2"],requires:["registeredSource","testMapping"],guarantees:["SOURCE_CODE_CAPTURE","UNMAPPED_TO_RECONCILIATION"]},
 FHIR_R4_IMPORT_V1:{direction:"INBOUND",protocols:["FHIR_R4"],resources:["Bundle","Observation","DiagnosticReport"],guarantees:["RESOURCE_PROVENANCE","OBSERVATION_MAPPING"]}
};