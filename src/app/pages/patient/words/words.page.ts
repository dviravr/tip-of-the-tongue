import { Component, OnInit } from '@angular/core';
import { Word } from '../../../core/models/word.model';
import { WordService } from '../../../core/services/word/word.service';
import { Router } from '@angular/router';
import { ReportService } from '../../../core/services/report/report.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { User } from '../../../core/models/user.model';

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
              private reportService: ReportService) {
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

  async findWord(word: Word) {
    const loggedInUser: User = (await this.authService.loggedInUser$.toPromise())[1];
    this.reportService.endTime = new Date();
    this.reportService.createNewReport(loggedInUser, word);
  }
}
