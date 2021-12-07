import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserTypeEnum } from '../../../core/enum/userType.enum';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user/user.service';
import { User } from '../../../core/models/user.model';
import { NavController } from '@ionic/angular';

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

  constructor(private router: Router,
              private userService: UserService,
              private navController: NavController) {
  }

  ngOnInit() {
    this.segmentChanged(UserTypeEnum.patient);
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
      email: new FormControl(this.userService.firebaseUser.email, [
        Validators.required,
        Validators.email
      ]),
      birthDate: new FormControl(undefined, [
        Validators.required
      ])
    });
  }

  segmentChanged(newValue: UserTypeEnum) {
    this.userType = newValue;
  }

  async registerUser() {
    const { firstName, lastName, phoneNumber, email, birthDate } = this.registerForm.value;
    const user: User = {
      userType: this.userType,
      email,
      firstName,
      lastName,
      birthDate,
      phoneNumber
    } as User;
    await this.userService.signupNewUser(user);
    this.navController.navigateForward('home');
  }
}
