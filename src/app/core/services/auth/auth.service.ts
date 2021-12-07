import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserService } from '../user/user.service';
import { User as FirebaseUser } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private angularFireAuth: AngularFireAuth,
              private userService: UserService) {
    this.angularFireAuth.authState.subscribe(_ => {
      console.log(_);
    });
  }

  loginUserWithEmail(email: string, password: string, rememberMe: boolean) {
    const persistence = rememberMe ? auth.Auth.Persistence.LOCAL : auth.Auth.Persistence.NONE;
    return from(this.angularFireAuth.setPersistence(persistence)).pipe(
      switchMap(() => this.angularFireAuth.signInWithEmailAndPassword(email, password)),
      switchMap(async (userCredential: auth.UserCredential) => this.userService.loginUser(this.getPartialFirebaseUser(userCredential.user)))
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
