import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { CollectionEnum } from '../../enum/collections.enum';
import { GenericModelService } from '../generic-model/generic-model.service';
import { FirestoreUser, User } from '../../models/user.model';
import { User as FirebaseUser } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class UserService extends GenericModelService<User, FirestoreUser> {

  #loggedInUser: User;
  #firebaseUser: Partial<FirebaseUser>;

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

  get loggedInUser(): User {
    return this.#loggedInUser;
  }

  set loggedInUser(value: User) {
    this.#loggedInUser = value;
  }

  get firebaseUser(): Partial<FirebaseUser> {
    return this.#firebaseUser;
  }

  set firebaseUser(value: Partial<FirebaseUser>) {
    this.#firebaseUser = value;
  }

  async createNewUser(user: User) {
    this.loggedInUser = await this.create(user, this.firebaseUser.uid);
  }


  async loginUser(firebaseUser: Partial<FirebaseUser>) {
    this.firebaseUser = firebaseUser;
    const user = await this.getByUid(firebaseUser.uid);
    if (!user) {
      // return true if this is first login
      return true;
    } else {
      this.loggedInUser = user;
      return false;
    }
  }
}
