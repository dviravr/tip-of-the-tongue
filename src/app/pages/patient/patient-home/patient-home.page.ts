import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { IonRouterOutlet, ModalController, NavController } from '@ionic/angular';
import { ProfileComponent } from '../../../shared/components/profile/profile.component';

@Component({
  selector: 'app-patient-home',
  templateUrl: './patient-home.page.html',
  styleUrls: ['./patient-home.page.scss'],
})
export class PatientHomePage implements OnInit {

  constructor(private authService: AuthService,
              private routerOutlet: IonRouterOutlet,
              private modalController: ModalController,
              private navController: NavController) { }

  ngOnInit() {
  }

  goToMainCategories() {
    this.navController.navigateForward('/patient/categories');
  }

  async logout() {
    await this.authService.logoutUser();
  }

  async openMyProfile() {
    const modal = await this.modalController.create({
      component: ProfileComponent,
      cssClass: 'my-custom-class',
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
    return await modal.present();
  }
}
