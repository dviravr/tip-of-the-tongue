import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { CollectionEnum } from '../../enum/collections.enum';
import { GenericModelService } from '../generic-model/generic-model.service';
import { FirestoreUser, User } from '../../models/user.model';
import { User as FirebaseUser } from 'firebase/app';
import { from, Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService extends GenericModelService<User, FirestoreUser> {

  loggedInUser$: Observable<User>;

  constructor(protected angularFirestore: AngularFirestore,
              private angularFireAuth: AngularFireAuth) {
    super(angularFirestore, CollectionEnum.users);
    angularFireAuth.authState.subscribe(firebaseUser => {
      this.loggedInUser$ = from(firebaseUser ? this.getByUid(firebaseUser.uid) : of(null));
    });
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

  async signupNewUser(firebaseUser: FirebaseUser, user: User) {
    const newUser = await this.create(user, firebaseUser.uid);
    this.loggedInUser$ = from(of(newUser));
  }

  async loginUser(firebaseUser: Partial<FirebaseUser>) {
    const user = await this.getByUid(firebaseUser.uid);
    if (!user) {
      // return true if this is first login
      this.loggedInUser$ = from(of(null));
      return true;
    } else {
      this.loggedInUser$ = from(of(user));
      return false;
    }
  }

  logout() {
    this.loggedInUser$ = from(of(null));
  }
}
