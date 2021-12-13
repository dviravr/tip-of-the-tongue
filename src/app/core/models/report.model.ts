import { BaseModel } from './base.model';
import { DocumentReference } from '@angular/fire/firestore';
import { Word } from './word.model';

export interface ReportSearch extends BaseModel {
  patientID: string;
  word: Word;
  searchTime: number;
}

export interface FirestoreReportSearch {
  patientRef: DocumentReference;
  wordRef: DocumentReference;
  searchTime: number;
}
