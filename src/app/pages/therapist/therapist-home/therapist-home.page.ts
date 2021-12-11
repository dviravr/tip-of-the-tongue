import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-therapist-home',
  templateUrl: './therapist-home.page.html',
  styleUrls: ['./therapist-home.page.scss'],
})
export class TherapistHomePage implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  async logout() {
    await this.authService.logoutUser();
  }
}
