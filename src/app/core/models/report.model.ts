import { DocumentReference } from '@angular/fire/firestore';
import { Word } from './word.model';

export interface ReportSearch {
  id: string;
  patientId: string;
  word: Word;
  searchTime: number;
}

export interface FirestoreReportSearch {
  patientRef: DocumentReference;
  wordRef: DocumentReference;
  searchTime: number;
}
