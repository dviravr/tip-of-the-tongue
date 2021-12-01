import { User } from './user.model';
import { Patient } from './patient.model';
import { DocumentReference } from '@angular/fire/firestore';

export interface Therapist extends User {
  patients: Array<Patient>;
}

export interface FirestoreTherapist {
  firstName: string;
  lastName: string;
  email: string;
  patientsRefs: Array<DocumentReference>;
}
