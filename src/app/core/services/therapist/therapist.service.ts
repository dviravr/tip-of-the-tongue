import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { CollectionEnum } from '../../enum/collections.enum';
import { GenericModelService } from '../generic-model/generic-model.service';
import { FirestoreTherapist, Therapist } from '../../models/therapist.model';
import { Patient } from '../../models/patient.model';
import { PatientService } from '../patient/patient.service';

@Injectable({
  providedIn: 'root'
})
export class TherapistService extends GenericModelService<Therapist, FirestoreTherapist> {

  constructor(protected angularFirestore: AngularFirestore,
              private patientService: PatientService) {
    super(angularFirestore, CollectionEnum.therapists);
  }

  async mapModelToClient(doc: QueryDocumentSnapshot<DocumentData>): Promise<Therapist> {
    const data = doc.data();
    if (data) {
      // @ts-ignore
      data.id = doc.id;
      data.birthDate = data.birthDate.toDate();
      if (data.patientsRefs && data.patientsRefs.length > 0) {
        data.patients = await this.patientService.getByUids(data.patientsRefs.map(patientRef => patientRef.ref.id));
      }
      delete data.patientsRefs;
      return data as Therapist;
    }
  }
}
