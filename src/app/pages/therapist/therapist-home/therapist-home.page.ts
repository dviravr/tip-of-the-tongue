import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import Swal from 'sweetalert2';
import { take } from 'rxjs/operators';
import { Clipboard } from '@angular/cdk/clipboard';
import { IonRouterOutlet, ModalController, NavController, ToastController } from '@ionic/angular';
import { ProfileComponent } from '../../../shared/components/profile/profile.component';

@Component({
  selector: 'app-therapist-home',
  templateUrl: './therapist-home.page.html',
  styleUrls: ['./therapist-home.page.scss']
})
export class TherapistHomePage implements OnInit {

  constructor(private authService: AuthService,
              private toastController: ToastController,
              private clipboard: Clipboard,
              private routerOutlet: IonRouterOutlet,
              private modalController: ModalController,
              private navController: NavController) {
  }

  ngOnInit() {
  }

  async logout() {
    await this.authService.logoutUser();
  }

  async sendLinkToPatient() {
    this.authService.loggedInUser$.pipe(take(1)).subscribe(async (user) => {
      const link = `localhost:8100/patient/connect-to-therapist/${ user.id }`;
      const result = await Swal.fire({
        title: 'שלח קישור למטופל',
        heightAuto: false,
        customClass: {
          popup: 'share-business-swal-popup',
          confirmButton: 'whatsapp-action-button'
        },
        denyButtonText: '<i class="fas fa-link"></i> העתקת קישור',
        showDenyButton: true,
        confirmButtonText: '<i class="fab fa-whatsapp"></i> שליחה',
      });

      if (result.isConfirmed) {
        window.open(`https://wa.me/?text=${link}`);
      } else if (result.isDenied) {
        this.clipboard.copy(link);
        await (await this.toastController.create({
          message: '!לינק הועתק בהצלחה',
          duration: 2000,
          cssClass: 'text-right',
          color: 'medium'
        })).present();
      }
    });
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

  openMyPatients() {
    this.navController.navigateForward('therapist/my-patients');
  }
}
