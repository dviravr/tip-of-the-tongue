import { BaseModel } from './base.model';
import { DocumentReference } from '@angular/fire/firestore';

export interface Word extends BaseModel {
  word: string;
  categoriesIds: Array<string>;
  patientId?: string;
  subQuestion: string;
}

export interface FirestoreWord {
  word: string;
  categoriesIds: Array<string>;
  patientRef?: DocumentReference;
  subQuestion: string;
}
