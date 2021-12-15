import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { NavController } from '@ionic/angular';
import { UserService } from '../../core/services/user/user.service';
import { UserTypeEnum } from '../../core/enum/userType.enum';

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
  errorMessage: string;

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
        }).catch((error) => {
          this.handelErrors(error);
        });
      } else {
        await this.authService.loginUserWithEmail(email, password, this.rememberMe).catch((error) => {
          this.handelErrors(error);
        });
        this.goToHome(UserTypeEnum.patient);
      }
    }
  }

  handelErrors(error) {
    if (error.code === 'auth/email-already-in-use') {
      this.errorMessage = 'מייל זה נמצא בשימוש';
    } else if (error.code === 'auth/user-not-found') {
      this.errorMessage = 'משתמש לא רשום, אנא עבור להרשמה';
    } else {
      this.errorMessage = 'התרחשה שגיאה לא צפויה';
    }
  }

  goToFirstLogin() {
    this.navController.navigateForward('first-login');
  }

  goToHome(userType: UserTypeEnum) {
    this.navController.navigateForward(userType);
  }
}
