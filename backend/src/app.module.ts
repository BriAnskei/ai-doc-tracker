import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Role } from './entities/role.entity';
import { IncomingDocumentFile } from './entities/incoming-document-file.entity';
import { InvalidDocument } from './entities/invalid-document.entity';
import { IncomingDocQueue } from './entities/incoming-doc-queue.entity';
import { UploadController } from './controllers/upload.controller';
import { InvalidDocumentsController } from './controllers/invalid-documents.controller';
import { AiExtractorController } from './controllers/ai-extractor.controller';
import { DocumentQueueController } from './controllers/document-queue.controller';
import { IncomingDocuments } from './entities/incoming-documents.entity';
import { getDatabaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        console.log('DATABASE_URL:', config.get('DATABASE_URL'));

        return getDatabaseConfig(config);
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forFeature([
      Role,
      IncomingDocumentFile,
      InvalidDocument,
      IncomingDocQueue,
      IncomingDocuments,
    ]),
  ],
  controllers: [AppController, UploadController, InvalidDocumentsController, DocumentQueueController],
  providers: [AppService],
})
export class AppModule {}
