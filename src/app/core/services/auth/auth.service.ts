import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, User as FirebaseUser } from 'firebase/app';
import { forkJoin, from, Observable, of } from 'rxjs';
import { mergeMap, switchMap, tap } from 'rxjs/operators';
import { UserService } from '../user/user.service';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  firebaseUser$: Observable<[FirebaseUser, User]>;

  constructor(private angularFireAuth: AngularFireAuth,
              private userService: UserService) {
    this.firebaseUser$ = angularFireAuth.authState.pipe(
      mergeMap((firebaseUser) => forkJoin([
        of(firebaseUser),
        from(firebaseUser ? this.userService.getByUid(firebaseUser.uid) : of(null))
      ])),
      tap(async ([firebaseUser, appUser]) => {
        if (firebaseUser) {
          await this.userService.loginUser(this.getPartialFirebaseUser(firebaseUser));
        }
      }));
  }

  loginUserWithEmail(email: string, password: string, rememberMe: boolean) {
    const persistence = rememberMe ? auth.Auth.Persistence.LOCAL : auth.Auth.Persistence.NONE;
    return from(this.angularFireAuth.setPersistence(persistence)).pipe(
      switchMap(() => this.angularFireAuth.signInWithEmailAndPassword(email, password)),
      switchMap(async (userCredential: auth.UserCredential) => this.userService.loginUser(this.getPartialFirebaseUser(userCredential.user)))
    );
  }

  logoutUser() {
    return from(this.angularFireAuth.signOut()).pipe(
      // switchMap(() => this.firebaseUser$ = from(of(null))),
      switchMap(async () => this.userService.logout())
    );
  }

  signupWithEmail(email: string, password: string, rememberMe: boolean) {
    return this.angularFireAuth.createUserWithEmailAndPassword(email, password);
  }

  getPartialFirebaseUser(user: FirebaseUser): Partial<FirebaseUser> {
    // Add here any data the stored on the firebase user that we will need to use.
    return {
      uid: user.uid,
      email: user.email,
      providerData: user.providerData,
      providerId: user.providerId,
    };
  }
}
