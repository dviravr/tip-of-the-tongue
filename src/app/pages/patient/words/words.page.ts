import { Component, OnInit } from '@angular/core';
import { Word } from '../../../core/models/word.model';
import { WordService } from '../../../core/services/word/word.service';
import { Router } from '@angular/router';
import { ReportService } from '../../../core/services/report/report.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { User } from '../../../core/models/user.model';
import { ActionSheetController, NavController, ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-words',
  templateUrl: './words.page.html',
  styleUrls: ['./words.page.scss']
})
export class WordsPage implements OnInit {

  finalWord: Array<Word>;
  isLoading: boolean;
  categoriesIds: Array<string>;
  isAddNewWord: boolean;
  newWord: string;
  loggedInUser: User;
  subscriptions: Array<Subscription>;

  constructor(private wordService: WordService,
              private router: Router,
              private vibration: Vibration,
              private authService: AuthService,
              private reportService: ReportService,
              private toastController: ToastController,
              private actionSheetController: ActionSheetController,
              private navController: NavController,
              public alertController: AlertController) {
  }

  async ngOnInit() {
    this.isLoading = true;
    this.categoriesIds = this.router.getCurrentNavigation().extras.state?.categoryID;
    this.isAddNewWord = this.router.getCurrentNavigation().extras.state?.isAddNewWord;
    if (this.categoriesIds) {
      this.authService.loggedInUser$.subscribe(async user => {
        this.loggedInUser = user;
        this.finalWord = await this.wordService.getFinalWords(this.categoriesIds, user?.id);
        this.isLoading = false;
      });
    } else {
      this.navController.navigateRoot('/patient/home');
    }
  }

  async chooseWord(word: Word) {
    if (!this.isAddNewWord) {
      this.vibration.vibrate(50);
      this.reportService.endTime = new Date();
      await this.reportService.createNewReport(this.loggedInUser, word, this.categoriesIds[0]);
      await this.presentAlertConfirm();
    }
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: '?מה תרצו לעשות',
      mode: 'ios',
      buttons: [
        {
          text: 'לחפש שוב את המילה.',
          icon: 'repeat',
          handler: () => {
            this.navController.navigateRoot('/patient/categories');
          }
        },
        {
          icon: 'home',
          text: 'לחזור למסך הראשי',
          handler: () => {
            this.navController.navigateRoot('/patient/home');
          }
        },
        {
          text: 'ביטול',
          icon: 'close',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    await actionSheet.present();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'text-center',
      mode: 'ios',
      header: '!הצלחת למצוא את המילה האבודה',
      message: 'אנחנו מעבירים את המידע אודות החיפוש לקלינאי המטפל שלך',
      buttons: [
        {
          text: 'בסדר',
          handler: () => {
            this.navController.navigateRoot('/patient/home');
          }
        }
      ]
    });

    await alert.present();
  }

  async addNewWord() {
    if (this.newWord) {
      await this.wordService.addNewWord(this.newWord, this.categoriesIds, this.loggedInUser?.id);
      const toast = await this.toastController.create({
        message: 'מילה נוספה בהצלחה!',
        mode: 'ios',
        color: 'success',
        duration: 2000
      });
      toast.present();
      this.navController.navigateRoot('patient/home');
    }
  }
}

