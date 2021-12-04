import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { NavParams } from '@ionic/angular';
import {Word} from '../../core/models/word.model';
import {WordService} from '../../core/services/word/word.service';
import {WordsPageModule} from './words.module';


@Component({
  selector: 'app-words',
  templateUrl: './words.page.html',
  styleUrls: ['./words.page.scss'],

})
export class WordsPage implements OnInit {

  finalWord: Array<Word>;
  isLoading: boolean;
  categoryID: string;

  constructor(private wordService: WordService,
              private route: ActivatedRoute,
              private navParams: NavParams) {
    //const categoryID = navParams.get('categoryID');
  }

  async ngOnInit() {
    //let eventId= this.activatedRoute.snapshot.params.eventId;
    this.isLoading = true;
    this.categoryID = this.route.snapshot.paramMap.get('categoryID');
    this.finalWord = await this.wordService.getFinalWords(this.categoryID);
    this.isLoading = false;

  }
}
