import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-patient-home',
  templateUrl: './patient-home.page.html',
  styleUrls: ['./patient-home.page.scss'],
})
export class PatientHomePage implements OnInit, OnDestroy {

  subscription: Subscription;

  constructor(private authService: AuthService,
              private navController: NavController) { }

  ngOnInit() {
  }

  logout() {
    this.subscription = this.authService.logoutUser().subscribe(() => {
      this.navController.navigateBack('login');
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
