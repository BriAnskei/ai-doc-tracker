import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IncomingDocumentFile } from './incoming-document-file.entity';

@Entity('incoming_documents')
export class IncomingDocuments {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @ManyToOne(() => IncomingDocumentFile)
  @JoinColumn({ name: 'document_file_id' })
  documentFile: IncomingDocumentFile;

  @Column({ type: 'uuid', name: 'document_file_id' })
  documentFileId: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'ongoing', 'complete'],
    default: 'pending',
  })
  status: 'pending' | 'ongoing' | 'complete';

  @Column({ type: 'varchar', length: 255, nullable: true })
  action: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  taken: Date | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
