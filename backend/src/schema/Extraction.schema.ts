import { z } from "zod";
import {
  SchemaType,
  type Schema,
  type ObjectSchema,
  type StringSchema,
} from "@google/generative-ai";

// ── Zod schemas (for response validation) ──────────────────────

export const GeminiExtractionSchema = z.object({
  subject: z.string(),
  from: z.string(),
  to: z.string(),
  date_received: z.string(),
  time_received: z.string().optional(),
  summary: z.string().optional(),
});

export type GeminiExtractionType = z.infer<typeof GeminiExtractionSchema>;

export const CreateExtractionResponseSchema = GeminiExtractionSchema.extend({
  idCode: z.string().optional(),
  routedTo: z.string().optional(),
  noticeOfAction: z.string().optional(),
  actionTaken: z.string().optional(),
});

export type CreateExtractionResponseType = z.infer<
  typeof CreateExtractionResponseSchema
>;

// ── Gemini SDK schemas (for responseSchema) ────────────────────

export const geminiExtractionSchema: ObjectSchema = {
  type: SchemaType.OBJECT,
  properties: {
    subject: { type: SchemaType.STRING } as StringSchema,
    from: { type: SchemaType.STRING } as StringSchema,
    to: { type: SchemaType.STRING } as StringSchema,
    date_received: { type: SchemaType.STRING } as StringSchema,
    time_received: { type: SchemaType.STRING } as StringSchema,
    summary: { type: SchemaType.STRING } as StringSchema,
  },
  required: ["subject", "from", "to", "date_received"],
};
