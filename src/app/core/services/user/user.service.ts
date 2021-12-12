import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { CollectionEnum } from '../../enum/collections.enum';
import { GenericModelService } from '../generic-model/generic-model.service';
import { FirestoreUser, User } from '../../models/user.model';
import { UserTypeEnum } from '../../enum/userType.enum';

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
      if (data.patientsRefs) {
        data.patients = data.patientsRefs.map(patientRef => patientRef.id);
      }
      if (data.therapistRef) {
        data.therapistId = data.therapistRef.id;
      }
      delete data.patientsRefs;
      delete data.therapistRef;
      return data as User;
    }
  }

  async connectToTherapist(therapist: User, patient: User) {
    if (therapist.userType === UserTypeEnum.therapist && patient.userType === UserTypeEnum.patient) {
      const therapistRef = await this.getReferenceByUid(therapist.id);
      await this.update(patient.id, { therapistRef });
      const patientRef = await this.getReferenceByUid(patient.id);
      let newPatientsRefs = await this.getReferencesByUids(therapist.patientsIds ? therapist.patientsIds : []);
      if (!newPatientsRefs.includes(patientRef)) {
        newPatientsRefs.push(patientRef);
      }
      await this.update(therapist.id, { patientsRefs: newPatientsRefs });
    }
  }
}
