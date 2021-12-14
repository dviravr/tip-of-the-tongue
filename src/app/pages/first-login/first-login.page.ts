import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserTypeEnum } from '../../core/enum/userType.enum';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user/user.service';
import { FirestoreUser } from '../../core/models/user.model';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../core/services/auth/auth.service';
import { User as FirebaseUser } from 'firebase/app';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-first-login',
  templateUrl: './first-login.page.html',
  styleUrls: ['./first-login.page.scss']
})
export class FirstLoginPage implements OnInit {

  userTypeEnum = UserTypeEnum;
  userType: UserTypeEnum;
  registerForm: FormGroup;
  validationMessages = {
    firstName: [
      { type: 'required', message: 'נדרש להזין שם פרטי' }
    ],
    lastName: [
      { type: 'required', message: 'נדרש להזין שם משפחה' }
    ],
    phoneNumber: [
      { type: 'required', message: 'נדרש להזין מספר טלפון' },
      { type: 'pattern', message: 'הזינו מספר טלפון תקין' }
    ],
    birthDate: [
      { type: 'required', message: 'נדרש להזין תאריך לידה' }
    ]
  };
  firebaseUser: FirebaseUser;

  constructor(private router: Router,
              private userService: UserService,
              private authService: AuthService,
              private navController: NavController) {
  }

  ngOnInit() {
    this.registerForm = new FormGroup({
      firstName: new FormControl(undefined, [
        Validators.required
      ]),
      lastName: new FormControl(undefined, [
        Validators.required
      ]),
      phoneNumber: new FormControl(undefined, [
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern(/^05\d{8}$/),
        Validators.required
      ]),
      email: new FormControl(undefined, [
        Validators.required,
        Validators.email
      ]),
      birthDate: new FormControl(undefined, [
        Validators.required
      ])
    });
    this.authService.firebaseUser$.pipe(take(1)).subscribe((firebaseUser) => {
      this.firebaseUser = firebaseUser;
      this.registerForm.get('email').setValue(firebaseUser.email);
    });
    this.segmentChanged(UserTypeEnum.patient);
  }

  segmentChanged(newValue: UserTypeEnum) {
    this.userType = newValue;
  }

  async registerUser() {
    const { firstName, lastName, phoneNumber, email, birthDate } = this.registerForm.value;
    const user: FirestoreUser = {
      userType: this.userType,
      email,
      firstName,
      lastName,
      birthDate,
      phoneNumber
    } as FirestoreUser;
    await this.authService.registerNewUser(this.firebaseUser, user);
    this.navController.navigateRoot(user.userType, { animationDirection: 'forward' });
  }
}
