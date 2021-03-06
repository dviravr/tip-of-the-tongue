import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../core/services/user/user.service';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth/auth.service';
import { take } from 'rxjs/operators';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-connect-to-therapist',
  templateUrl: './connect-to-therapist.page.html',
  styleUrls: ['./connect-to-therapist.page.scss'],
})
export class ConnectToTherapistPage implements OnInit {

  therapist: User;
  loggedInUser: User;
  isLoading: boolean;

  constructor(private activatedRoute: ActivatedRoute,
              private userService: UserService,
              private navController: NavController,
              private alertController: AlertController,
              private authService: AuthService) { }

  async ngOnInit() {
    this.isLoading = true;
    this.authService.loggedInUser$.pipe(take(1)).subscribe(async (user) => {
      this.loggedInUser = user;
      let therapistId = this.activatedRoute.snapshot.params.therapistId;
      if (therapistId) {
        this.therapist = await this.userService.getByUid(therapistId);
      }
      this.isLoading = false;
    })
  }

  async connectToTherapist() {
    await this.userService.connectToTherapist(this.therapist, this.loggedInUser);
    await this.presentAlertConfirm();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'text-center',
      mode:'ios',
      header: 'התחברת למטפל בהצלחה!',
      buttons: [
        {
          text: 'חזור לדף הבית',
          handler: () => {
            this.navController.navigateRoot('/patient/home');
          },
        },
      ],
    });

    await alert.present();
  }
}
