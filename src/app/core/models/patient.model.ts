import { BaseModel } from './base.model';
import { Therapist } from './therapist.model';
import { DocumentReference } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

export interface Patient extends BaseModel {
  birthDate: Date;
  therapistId?: string;
}

export interface FirestorePatient {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date | firebase.firestore.Timestamp;
  therapistRef: DocumentReference;
}
