import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import {
  CreateExtractionResponseSchema,
  geminiExtractionSchema,
} from '../schema/Extraction.schema';
import { getGenerativeModel } from '../util/ai';

interface ExtractRequest {
  prompt: string;
  systemInstruction: string;
}

@Controller('ai')
export class AiExtractorController {
  @Post('extract')
  @HttpCode(HttpStatus.OK)
  async generateHandler(@Body() body: ExtractRequest) {
    const { prompt, systemInstruction } = body;
    if (!prompt || !systemInstruction) {
      return {
        success: false,
        error: 'Missing fields',
      };
    }

    const model = getGenerativeModel({
      systemInstruction,
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: geminiExtractionSchema,
      },
    });

    let MAX_ATTEMPTS = 2;
    let lastError: string | undefined;

    while (MAX_ATTEMPTS > 0) {
      try {
        const result = await model.generateContent(prompt);
        const rawText = result.response.text();

        let json: unknown;
        try {
          json = JSON.parse(rawText);
        } catch {
          lastError = 'Model returned invalid JSON';
          MAX_ATTEMPTS--;
          continue;
        }

        const parsed = CreateExtractionResponseSchema.safeParse(json);
        console.log('parsed data: ', parsed);
        if (parsed.success) {
          return {
            success: true,
            res: {
              ...parsed.data,
              time_received: parsed.data.time_received ?? '',
              summary: parsed.data.summary ?? '',
            },
          };
        }

        lastError = parsed.error.message;
      } catch (err: any) {
        lastError = err.message;
      }

      MAX_ATTEMPTS--;
    }

    return {
      success: false,
      error: lastError ?? 'Failed request',
    };
  }
}
