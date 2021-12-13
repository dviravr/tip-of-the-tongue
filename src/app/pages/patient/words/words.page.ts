import { Component, OnInit } from '@angular/core';
import { Word } from '../../../core/models/word.model';
import { WordService } from '../../../core/services/word/word.service';
import { Router } from '@angular/router';
import { ReportService } from '../../../core/services/report/report.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { User } from '../../../core/models/user.model';
import { ActionSheetController, NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

// import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';

@Component({
  selector: 'app-words',
  templateUrl: './words.page.html',
  styleUrls: ['./words.page.scss']
})
export class WordsPage implements OnInit {

  finalWord: Array<Word>;
  isLoading: boolean;
  categoriesIds: Array<string>;
  question: string;

  constructor(private wordService: WordService,
              private router: Router,
              private authService: AuthService,
              private reportService: ReportService,
              private actionSheetController: ActionSheetController,
              private navController: NavController,
              public alertController: AlertController) {
  }

  async ngOnInit() {
    this.isLoading = true;
    this.categoriesIds = this.router.getCurrentNavigation().extras.state?.categoryID;
    this.question = this.router.getCurrentNavigation().extras.state?.question;
    if (this.categoriesIds) {
      this.finalWord = await this.wordService.getFinalWords(this.categoriesIds);
    }
    console.log(this.categoriesIds);
    console.log(this.finalWord);
    console.log((this.question));

    this.isLoading = false;
  }

  async chooseWord(word: Word) {
    // this.vibration.vibrate(500);
    await this.presentAlertConfirm();
    const loggedInUser: User = (await this.authService.loggedInUser$.toPromise())[1];
    this.reportService.endTime = new Date();
    this.reportService.createNewReport(loggedInUser, word);
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: '?מה תרצו לעשות',
      mode:'ios',
      buttons: [
        {
          text: 'לחפש שוב את המילה.',
          icon: 'repeat',
          handler: () => {
            this.navController.navigateRoot('/patient/categories');
            console.log('Delete clicked');
          },
        },
        {
          icon: 'home',
          text: 'לחזור למסך הראשי',
          handler: () => {
            this.navController.navigateRoot('/patient/home');
            console.log('Share clicked');
          },
        },
        {
          text: 'דיווח לקלינאי תקשורת המטפל',
          icon: 'person',
          handler: () => {
            console.log('Play clicked');
          },
        },

        {
          text: 'ביטול',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'text-center',
      mode:'ios',
      header: '!הצלחת למצוא את המילה האבודה',
      message: 'אנחנו מעבירים את המידע אודות החיפוש לקלינאי המטפל שלך',
      buttons: [
        {
          text: 'בסדר',
          handler: () => {
            this.navController.navigateRoot('/patient/home');
            console.log('Confirm Okay');
          },
        },
      ],
    });

    await alert.present();
  }
}

