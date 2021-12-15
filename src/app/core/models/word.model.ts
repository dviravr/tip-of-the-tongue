import { DocumentReference } from '@angular/fire/firestore';

export interface Word {
  id: string;
  word: string;
  categoriesIds: Array<string>;
  patientId?: string;
}

export interface FirestoreWord {
  word: string;
  categoriesIds: Array<string>;
  patientRef?: DocumentReference;
}
