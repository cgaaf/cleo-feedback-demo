export interface Instruction {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

export interface InstructionVersion {
  id: string;
  instructionId: string;
  content: string;
  version: number;
  feedback?: string;
  createdAt: Date;
  changeDescription?: string;
}

export interface Feedback {
  id: string;
  transcription: string;
  processedAt: Date;
  appliedChanges?: string;
  status: 'pending' | 'processing' | 'applied' | 'failed';
}

export interface InstructionUpdate {
  oldContent: string;
  newContent: string;
  feedback: string;
  changes: string[];
}