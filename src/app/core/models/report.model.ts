import { DocumentReference } from '@angular/fire/firestore';
import { Word } from './word.model';
import { Category } from './category.model';

export interface ReportSearch {
  id: string;
  patientId: string;
  word: Word;
  mainCategory: Category;
  searchTime: number;
}

export interface FirestoreReportSearch {
  patientRef: DocumentReference;
  wordRef: DocumentReference;
  mainCategoryRef: DocumentReference;
  searchTime: number;
}
