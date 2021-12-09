import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { NavController } from '@ionic/angular';
import { UserService } from '../../core/services/user/user.service';
import { Subscription } from 'rxjs';
import { UserTypeEnum } from '../../core/enum/userType.enum';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;

  validationMessages = {
    email: [
      { type: 'required', message: 'נדרש להזין אימייל' },
      { type: 'email', message: 'נדרש להזין אימייל תקין' }
    ],
    password: [
      { type: 'required', message: 'נדרש להזין סיסמא' },
      { type: 'minlength', message: 'אורך הסיסמא חייב להיות לפחות 6 תווים' }
    ]
  };
  passwordVisible: boolean;
  isRegistration: boolean;
  rememberMe: boolean;

  constructor(private authService: AuthService,
              private userService: UserService,
              private navController: NavController) {
  }

  ngOnInit() {
    this.rememberMe = true;
    this.passwordVisible = false;
    this.isRegistration = false;
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.minLength(6),
        Validators.required
      ]),
      rememberMe: new FormControl(true)
    });
  }

  async loginUser() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      if (this.isRegistration) {
        this.authService.signupWithEmail(email, password, this.rememberMe).then(() => {
          this.goToFirstLogin();
        });
      } else {
        this.authService.loginUserWithEmail(email, password, this.rememberMe).pipe(take(1)).subscribe((user) => {
          if (user) {
            this.goToHome(user.userType);
          } else {
            this.goToFirstLogin();
          }
        });
      }
    }
  }

  goToFirstLogin() {
    this.navController.navigateForward('first-login');
  }

  goToHome(userType: UserTypeEnum) {
    this.navController.navigateRoot(userType, { animationDirection: 'forward' });
  }
}
