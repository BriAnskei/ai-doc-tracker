import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerStorage } from '../config/multer.config';
import { IncomingDocumentFile } from '../entities/incoming-document-file.entity';
import { InvalidDocument } from '../entities/invalid-document.entity';
import { IncomingDocQueue } from '../entities/incoming-doc-queue.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { GoogleGenAI } from '@google/genai';

interface AiExtractionResult {
  subject: string;
  from: string;
  to: string;
  date_received: string;
}

interface QueueListItem {
  id: string;
  fileName: string;
  from: string;
  uploadedAt: Date;
  status: 'on-queue' | 'received';
}

@Controller('upload')
export class UploadController {
  constructor(
    @InjectRepository(IncomingDocumentFile)
    private readonly fileRepository: Repository<IncomingDocumentFile>,

    @InjectRepository(InvalidDocument)
    private readonly invalidDocRepository: Repository<InvalidDocument>,

    @InjectRepository(IncomingDocQueue)
    private readonly queueRepository: Repository<IncomingDocQueue>,

    private readonly configService: ConfigService,
  ) {}

  @Post('receiver')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file', { storage: multerStorage }))
  async uploadReceiverDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body('documentText') documentText: string,
    @Body('uploaderId') uploaderId: string,
  ): Promise<{
    success: boolean;
    fileId: string;
    queueId?: string;
    invalidDocId?: string;
    missingFields?: string[];
    message: string;
  }> {
    if (!file) {
      return { success: false, fileId: '', message: 'No file uploaded' };
    }

    if (!uploaderId) {
      return { success: false, fileId: '', message: 'uploaderId is required' };
    }

    // Save incoming_document_files record
    const docFile = this.fileRepository.create({
      id: uuidv4(),
      uploaderId,
      name: file.originalname,
      path: file.path,
    });
    await this.fileRepository.save(docFile);

    // Extract text from document (use client-provided text or empty string)
    const textToAnalyze = documentText || '';

    if (!process.env.GOOGLE_AI_KEY) {
      return {
        success: false,
        fileId: '',
        message: 'GOOGLE_AI_KEY is not configured',
      };
    }

    // Call Google AI Studio for field extraction
    const aiResult = await this.extractFieldsWithAi(textToAnalyze);

    // Determine required fields and check for missing ones
    const requiredFields = ['subject', 'from', 'to', 'date_received'];
    const missingFields: string[] = [];

    for (const field of requiredFields) {
      const value = aiResult[field as keyof AiExtractionResult];
      if (!value || value.trim().length === 0) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      // At least one field missing → create invalid_documents record
      const invalidDoc = this.invalidDocRepository.create({
        id: uuidv4(),
        documentFileId: docFile.id,
        missingFields: JSON.stringify(missingFields),
        aiResponse: JSON.stringify(aiResult),
      });
      await this.invalidDocRepository.save(invalidDoc);

      return {
        success: true,
        fileId: docFile.id,
        invalidDocId: invalidDoc.id,
        missingFields,
        message: `Document uploaded with missing fields: ${missingFields.join(', ')}`,
      };
    }

    // All fields present → create incoming_doc_queue record with status 'on_queue'
    const queueEntry = this.queueRepository.create({
      id: uuidv4(),
      documentFileId: docFile.id,
      status: 'on_queue',
    });
    await this.queueRepository.save(queueEntry);

    return {
      success: true,
      fileId: docFile.id,
      queueId: queueEntry.id,
      message: 'Document uploaded and queued for processing',
    };
  }

  @Get('queue')
  @HttpCode(HttpStatus.OK)
  async getQueuedDocuments(): Promise<QueueListItem[]> {
    const entries = await this.queueRepository.find({
      relations: { documentFile: true },
      order: { createdAt: 'DESC' },
    });

    return entries
      .filter((entry) => !!entry.documentFile)
      .map((entry) => ({
        id: entry.id,
        fileName: entry.documentFile.name,
        // TODO: replace with a join to users.Full_name once a User entity/relation exists
        from: entry.documentFile.uploaderId,
        uploadedAt: entry.createdAt,
        status: entry.status === 'on_queue' ? 'on-queue' : 'received',
      }));
  }

  private async extractFieldsWithAi(text: string): Promise<AiExtractionResult> {
    const apiKey = this.configService.get<string>('GOOGLE_AI_KEY');

    const ai = new GoogleGenAI({
      apiKey,
    });

    console.log(
      {
        keyExists: !!apiKey,
        keyLength: apiKey?.length,
        keyStart: apiKey?.substring(0, 5),
      },
      apiKey,
    );

    const systemInstruction =
      'You are a document extraction assistant. Extract structured metadata from document text. ' +
      'Return ONLY a valid JSON object with no markdown, no explanations, no extra text. ' +
      'Required fields: subject, from, to, date_received. ' +
      'date_received must be in YYYY-MM-DD format. ' +
      'If a field cannot be found in the document, return an empty string for that field.';

    const extractionSchema = {
      type: 'object' as const,
      properties: {
        subject: { type: 'string' },
        from: { type: 'string' },
        to: { type: 'string' },
        date_received: { type: 'string' },
        time_received: { type: 'string' },
        summary: { type: 'string' },
      },
      required: ['subject', 'from', 'to', 'date_received'],
    };

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: extractionSchema,
        },
        contents: text,
      });

      const candidates = response.text;

      if (!candidates) {
        console.error('No content in AI response');
        return { subject: '', from: '', to: '', date_received: '' };
      }

      // Parse the JSON response from AI
      const cleaned = candidates.trim();
      const parsed = JSON.parse(cleaned);

      return {
        subject: parsed.subject || '',
        from: parsed.from || '',
        to: parsed.to || '',
        date_received: parsed.date_received || '',
      };
    } catch (error) {
      console.error('AI extraction error:', error);
      return { subject: '', from: '', to: '', date_received: '' };
    }
  }
}
