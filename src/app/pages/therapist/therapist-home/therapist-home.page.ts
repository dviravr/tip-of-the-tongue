import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import Swal from 'sweetalert2';
import { take } from 'rxjs/operators';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-therapist-home',
  templateUrl: './therapist-home.page.html',
  styleUrls: ['./therapist-home.page.scss']
})
export class TherapistHomePage implements OnInit {

  constructor(private authService: AuthService,
              private toastController: ToastController,
              private clipboard: Clipboard) {
  }

  ngOnInit() {
  }

  async logout() {
    await this.authService.logoutUser();
  }

  async sendLinkToPatient() {
    this.authService.loggedInUser$.pipe(take(1)).subscribe(async ([firebaseUser, user]) => {
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
        // let inviteMessage;
        // if (this.business.inviteToBusinessDynamicLink) {
        //   inviteMessage = 'היי, ' + this.business.name + ' מחכה לך באפליקציית Dibs לקביעת תורים בקלות ובמהירות! הצטרפו בלחיצה על הלינק הבא: '
        //     + this.business.inviteToBusinessDynamicLink;
        // } else {
        //   inviteMessage = 'היי, ' + this.business.name + ' מחכה לך באפליקציית Dibs לקביעת תורים בקלות ובמהירות! הצטרפו בלחיצה על הלינק הבא: http://onelink.to/wc49a3';
        // }
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
    })
  }
}
