import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-patient-home',
  templateUrl: './patient-home.page.html',
  styleUrls: ['./patient-home.page.scss'],
})
export class PatientHomePage implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  async logout() {
    await this.authService.logoutUser();
  }
}
