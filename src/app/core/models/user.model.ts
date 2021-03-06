import * as firebase from 'firebase';
import { DocumentReference } from '@angular/fire/firestore';
import { UserTypeEnum } from '../enum/userType.enum';

export interface User {
  id: string;
  userType: UserTypeEnum;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  birthDate: Date;
  therapistId?: string;
  patientsIds?: Array<string>;
  profilePicture: string;
  createDate: Date;
  updateDate: Date;
}

export interface FirestoreUser {
  userType: UserTypeEnum;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  birthDate?: Date | firebase.firestore.Timestamp;
  therapistRef?: DocumentReference;
  patientsRefs?: Array<DocumentReference>;
  profilePicture: string;
  createDate: Date | firebase.firestore.Timestamp;
  updateDate: Date | firebase.firestore.Timestamp;
}
