import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, User as FirebaseUser } from 'firebase/app';
import { forkJoin, from, Observable, of } from 'rxjs';
import { mergeMap, switchMap, take } from 'rxjs/operators';
import { UserService } from '../user/user.service';
import { FirestoreUser, User } from '../../models/user.model';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedInUser$: Observable<[FirebaseUser, User]>;

  constructor(private angularFireAuth: AngularFireAuth,
              private navController: NavController,
              private userService: UserService) {
    this.loggedInUser$ = angularFireAuth.authState.pipe(
      mergeMap((firebaseUser) => forkJoin([
        of(firebaseUser),
        from(firebaseUser ? this.userService.getByUid(firebaseUser.uid) : of(null))
      ])));
  }

  loginUserWithEmail(email: string, password: string, rememberMe: boolean) {
    const persistence = rememberMe ? auth.Auth.Persistence.LOCAL : auth.Auth.Persistence.NONE;
    return from(this.angularFireAuth.setPersistence(persistence)).pipe(
      switchMap(() => this.angularFireAuth.signInWithEmailAndPassword(email, password)),
      switchMap(async (userCredential: auth.UserCredential) => this.loginUser(userCredential.user))
    );
  }

  registerNewUser(firebaseUser: FirebaseUser, user: FirestoreUser) {
    this.loggedInUser$ = forkJoin([of(firebaseUser), this.userService.create(user, firebaseUser.uid)]);
  }

  async loginUser(newFirebaseUser: FirebaseUser) {
    const user = await this.userService.getByUid(newFirebaseUser.uid);
    this.loggedInUser$ = forkJoin([of(newFirebaseUser), of(user)]);
    return user;
  }

  async logoutUser() {
    await this.angularFireAuth.signOut();
    this.loggedInUser$ = forkJoin([of(null), of(null)]);
    this.navController.navigateRoot('login');
  }

  async signupWithEmail(email: string, password: string, rememberMe: boolean) {
    const persistence = rememberMe ? auth.Auth.Persistence.LOCAL : auth.Auth.Persistence.NONE;
    await this.angularFireAuth.setPersistence(persistence);
    await this.angularFireAuth.createUserWithEmailAndPassword(email, password);
  }

  updateLoggedInUser() {
    this.loggedInUser$ = this.loggedInUser$.pipe(
      mergeMap(([firebaseUser, user]) => forkJoin([
        of(firebaseUser),
        from(this.userService.getByUid(user.id))
      ])));
  }
}
