import { Injectable } from '@angular/core';
import { GenericModelService } from '../generic-model/generic-model.service';
import { FirestorePatient, Patient } from '../../models/patient.model';
import { AngularFirestore, DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { CollectionEnum } from '../../enum/collections.enum';

@Injectable({
  providedIn: 'root'
})
export class PatientService extends GenericModelService<Patient, FirestorePatient> {

  constructor(protected angularFirestore: AngularFirestore) {
    super(angularFirestore, CollectionEnum.patients);
  }

  mapModelToClient(doc: QueryDocumentSnapshot<DocumentData>): Patient {
    const data = doc.data();
    if (data) {
      // @ts-ignore
      data.id = doc.id;
      data.birthDate = data.birthDate.toDate();
      if (data.therapistRef && data.therapistRef.ref) {
        data.therapistId = data.therapistRef.ref.id;
      }
      delete data.therapistRef;
      return data as Patient;
    }
  }
}
