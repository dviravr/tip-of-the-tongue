import { Component, OnInit } from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router';
//import { NavParams } from '@ionic/angular';
import {Word} from '../../core/models/word.model';
import {WordService} from '../../core/services/word/word.service';


@Component({
  selector: 'app-words',
  templateUrl: './words.page.html',
  styleUrls: ['./words.page.scss'],

})
export class WordsPage implements OnInit {

  finalWord: Array<Word>;
  isLoading: boolean;
  categoryID: string;
  question: string;

  constructor(private wordService: WordService,
              private route: Router,
             ) {
    //const categoryID = navParams.get('categoryID');
  }

  async ngOnInit() {
    //let eventId= this.activatedRoute.snapshot.params.eventId;
    this.isLoading = true;
    this.categoryID = this.route.getCurrentNavigation().extras.state?.categoryID;
    this.question = this.route.getCurrentNavigation().extras.state?.question;
    if(this.categoryID){
      this.finalWord = await this.wordService.getFinalWords(this.categoryID);
    }
    console.log(this.categoryID);
    console.log(this.finalWord);
    console.log((this.question));

    this.isLoading = false;

  }
}
