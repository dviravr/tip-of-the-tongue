import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { CollectionEnum } from '../../enum/collections.enum';
import { GenericModelService } from '../generic-model/generic-model.service';
import { FirestoreUser, User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService extends GenericModelService<User, FirestoreUser> {

  constructor(protected angularFirestore: AngularFirestore) {
    super(angularFirestore, CollectionEnum.users);
  }

  mapModelToClient(doc: QueryDocumentSnapshot<DocumentData>): User {
    const data = doc.data();
    if (data) {
      // @ts-ignore
      data.id = doc.id;
      data.birthDate = data.birthDate.toDate();
      if (data.patientsRefs && data.patientsRefs.length > 0) {
        data.patients = data.patientsRefs.map(patientRef => patientRef.ref.id);
      }
      if (data.therapistRef && data.therapistRef.ref) {
        data.therapistId = data.therapistRef.ref.id;
      }
      delete data.patientsRefs;
      delete data.therapistRef;
      return data as User;
    }
  }
}
