import { DocumentReference } from '@angular/fire/firestore';

export interface Word {
  id: string;
  word: string;
  categories: { [key: string]: boolean };
  patientId?: string;
}

export interface FirestoreWord {
  word: string;
  categories: { [key: string]: boolean };
  patientRef?: DocumentReference;
}
