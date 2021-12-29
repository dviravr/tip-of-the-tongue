import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { User } from '../../../core/models/user.model';
import { take } from 'rxjs/operators';
import { UserService } from '../../../core/services/user/user.service';
import { ImageService } from '../../../core/services/image/image.service';
import { ReportService } from '../../../core/services/report/report.service';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import { PatientComponent } from '../components/patient/patient.component';

@Component({
  selector: 'app-my-patients',
  templateUrl: './my-patients.page.html',
  styleUrls: ['./my-patients.page.scss']
})
export class MyPatientsPage implements OnInit {

  loggedInUser: User;
  myPatients: Array<User>;
  myPatientsMap: Map<string, { wordsCounter: number; avgTime: number; profilePicture: string }>;
  isLoading: boolean;

  constructor(private authService: AuthService,
              private userService: UserService,
              private reportService: ReportService,
              private imageService: ImageService,
              private routerOutlet: IonRouterOutlet,
              private modalController: ModalController) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.myPatientsMap = new Map<string, { wordsCounter: number; avgTime: number; profilePicture: string }>();
    this.authService.loggedInUser$.pipe(take(1)).subscribe(async (user) => {
      this.loggedInUser = user;
      if (user.patientsIds?.length > 0) {
        this.myPatients = await this.userService.getByUids(user.patientsIds);
        for (const patient of this.myPatients) {
          const shortReport = await this.reportService.getShortReport(patient.id);
          const profilePicture = patient.profilePicture ?
            await this.imageService.getImageFromStorage(patient.profilePicture) :
            '../../../assets/icon/profile.svg';
          this.myPatientsMap.set(
            patient.id, {
              wordsCounter: shortReport.wordsCounter,
              avgTime: shortReport.avgTime,
              profilePicture
            }
          );
        }
      }
      this.isLoading = false;
    });
  }

  getReportText(patientId: string) {
    if (this.myPatientsMap.get(patientId).wordsCounter === 0) {
      return `מצא ${ this.myPatientsMap.get(patientId).wordsCounter } מילים`;
    }
    return `מצא ${ this.myPatientsMap.get(patientId).wordsCounter }
     מילים בממוצע של ${ this.myPatientsMap.get(patientId).avgTime.toFixed(1) } שניות למילה`;
  }

  async openPatientReport(patient: User) {
    const modal = await this.modalController.create({
      component: PatientComponent,
      cssClass: 'my-custom-class',
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps:{
        patient
      }
    });
    return await modal.present();
  }


}
