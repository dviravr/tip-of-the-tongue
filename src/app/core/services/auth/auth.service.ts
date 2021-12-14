import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, User as FirebaseUser } from 'firebase/app';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { UserService } from '../user/user.service';
import { FirestoreUser, User } from '../../models/user.model';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedInUser$: Observable<User>;
  firebaseUser$: Observable<FirebaseUser>

  constructor(private angularFireAuth: AngularFireAuth,
              private navController: NavController,
              private userService: UserService) {
    this.firebaseUser$ = angularFireAuth.authState.pipe(
      mergeMap( (firebaseUser) => {
        this.loggedInUser$ = firebaseUser ? this.userService.subscribeById(firebaseUser.uid) : of(null);
        return of(firebaseUser);
      }));
  }

  async loginUserWithEmail(email: string, password: string, rememberMe: boolean) {
    const persistence = rememberMe ? auth.Auth.Persistence.LOCAL : auth.Auth.Persistence.NONE;
    await this.angularFireAuth.setPersistence(persistence);
    return this.angularFireAuth.signInWithEmailAndPassword(email, password).then(async (userCredential: auth.UserCredential) => {
      await this.loginUser(userCredential.user);
      return this.loggedInUser$.toPromise();
    });
  }

  registerNewUser(firebaseUser: FirebaseUser, newUser: FirestoreUser) {
    this.userService.create(newUser, firebaseUser.uid).then(user => {
      this.loggedInUser$ = this.userService.subscribeById(user.id);
    });
  }

  async loginUser(newFirebaseUser: FirebaseUser) {
    this.loggedInUser$ = this.userService.subscribeById(newFirebaseUser.uid);
  }

  async logoutUser() {
    await this.angularFireAuth.signOut();
    this.loggedInUser$ = of(null);
    this.firebaseUser$ = of(null);
    this.navController.navigateRoot('login');
  }

  async signupWithEmail(email: string, password: string, rememberMe: boolean) {
    const persistence = rememberMe ? auth.Auth.Persistence.LOCAL : auth.Auth.Persistence.NONE;
    await this.angularFireAuth.setPersistence(persistence);
    await this.angularFireAuth.createUserWithEmailAndPassword(email, password);
  }

  updateLoggedInUser() {
    // this.loggedInUser$ = this.loggedInUser$.pipe(
    //   mergeMap(([firebaseUser, user]) => forkJoin([
    //     of(firebaseUser),
    //     from(this.userService.getByUid(user.id))
    //   ])));
  }
}
