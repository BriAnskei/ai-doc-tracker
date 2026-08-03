import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import {
  CreateExtractionResponseSchema,
  geminiExtractionSchema,
} from '../schema/Extraction.schema';
import { getGenerativeModel } from '../util/ai';

@Controller('ai')
export class AiExtractorController {
  @Post('extract')
  @HttpCode(HttpStatus.OK)
  async generateHandler(@Body() body: any) {
    //   const { prompt, systemInstruction } = body;
    //   if (!prompt || !systemInstruction) {
    //     return {
    //       success: false,
    //       error: "Missing fields",
    //     };
    //   }
    //   try {
    //     let MAX_ATTEMPTS = 2;
    //     while (MAX_ATTEMPTS > 0) {
    //       const model = getGenerativeModel();
    //       const response = await model.generateContent({
    //         contents: prompt,
    //         generationConfig: {
    //           systemInstruction,
    //           responseMimeType: "application/json",
    //           responseSchema: geminiExtractionSchema,
    //         },
    //       });
    //       const parsed = CreateExtractionResponseSchema.safeParse(
    //         JSON.parse(response.text as string),
    //       );
    //       if (parsed.success) {
    //         return {
    //           success: true,
    //           res: parsed.data,
    //         };
    //       }
    //       MAX_ATTEMPTS--;
    //     }
    //     return {
    //       success: false,
    //       error: "Failed request",
    //     };
    //   } catch (err: any) {
    //     return {
    //       success: false,
    //       error: err.message,
    //     };
    //   }
    // }
  }
}
