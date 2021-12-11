import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-patient-home',
  templateUrl: './patient-home.page.html',
  styleUrls: ['./patient-home.page.scss'],
})
export class PatientHomePage implements OnInit {

  constructor(private authService: AuthService,
              private navController: NavController) { }

  ngOnInit() {
  }

  goToMainCategories() {
    this.navController.navigateForward('/patient/categories');
  }

  async logout() {
    await this.authService.logoutUser();
  }
}
