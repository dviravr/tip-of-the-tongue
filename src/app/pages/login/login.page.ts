import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { NavController } from '@ionic/angular';
import { UserService } from '../../core/services/user/user.service';

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

  loginUser() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      if (this.isRegistration) {
        this.authService.createUserWithEmail(email, password, this.rememberMe).then(res => {
          this.goToFirstLogin();
        }).catch(error => {
          console.log(error);
        });
      } else {
        this.authService.loginUserWithEmail(email, password, this.rememberMe).subscribe((firstLogin) => {
          if (firstLogin) {
            this.goToFirstLogin();
          } else {
            this.goToHome();
          }
        });
      }
    }
  }

  goToFirstLogin() {
    this.navController.navigateForward('login/first-login');
  }

  goToHome() {
    this.navController.navigateForward('home');
  }
}
