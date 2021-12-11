import { Component, OnInit } from '@angular/core';
import { Word } from '../../../core/models/word.model';
import { WordService } from '../../../core/services/word/word.service';
import { Router } from '@angular/router';

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
              private router: Router
  ) {
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

}
