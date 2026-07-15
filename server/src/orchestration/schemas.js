import { z } from "zod";

const linkedText=z.object({
  text:z.string().min(1).max(1200),
  evidenceIds:z.array(z.string().regex(/^EV-\d{4}$/)).min(1).max(20)
});

export const aiOutputSchema=z.object({
  summary:z.string().min(1).max(2000),
  observations:z.array(linkedText).max(20),
  possibleAssociations:z.array(linkedText.extend({
    disclaimer:z.literal("Possible association; not a confirmed diagnosis.")
  })).max(20),
  verificationConsiderations:z.array(linkedText).max(20),
  criticalSignals:z.array(z.object({
    text:z.string().min(1).max(800),
    evidenceIds:z.array(z.string()).min(1),
    priority:z.enum(["ROUTINE","PRIORITY","CRITICAL"])
  })).max(20),
  safety:z.object({
    confirmedDiagnosis:z.literal(false),
    professionalReviewRequired:z.literal(true),
    measuredFactsMutable:z.literal(false)
  })
});

export const orchestrationRequestSchema=z.object({
  caseId:z.string().min(1),
  promptVersion:z.string().default("LAB_SUMMARY_V1")
});
