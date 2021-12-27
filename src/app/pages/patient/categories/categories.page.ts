import { Component, OnInit } from '@angular/core';
import { Category } from '../../../core/models/category.model';
import { WordService } from '../../../core/services/word/word.service';
import { CategoryService } from '../../../core/services/category/category.service';
import { NavController } from '@ionic/angular';
import { ReportService } from '../../../core/services/report/report.service';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss']
})
export class CategoriesPage implements OnInit {

  currentCategories: Array<Category>;
  isLoading: boolean;
  arrayOfCategories: Array<string>;
  question: string;
  isAddNewWord: boolean;

  constructor(private wordService: WordService,
              private router: Router,
              private vibration : Vibration,
              private categoryService: CategoryService,
              private navController: NavController,
              private reportService: ReportService) {
  }

  async ngOnInit() {
    this.isLoading = true;
    this.isAddNewWord = this.router.getCurrentNavigation().extras.state?.isAddNewWord;
    this.question = 'בחר קטגוריה ראשית';
    this.arrayOfCategories = [];
    this.currentCategories = await this.categoryService.getMainCategories();
    this.isLoading = false;
    this.reportService.startTime = new Date();
  }

  async goSubCategories(category: Category) {
    this.vibration.vibrate(50);
    this.arrayOfCategories.push(category.id);
    if (category.subCategories?.length > 0) {
      this.question = category.subQuestion;
      this.isLoading = true;
      this.currentCategories = await this.categoryService.getByUids(category.subCategories);
      this.isLoading = false;
    } else {
      this.navController.navigateRoot('/patient/words', {
        state: {
          categoryID: this.arrayOfCategories,
          question: category.subQuestion,
          isAddNewWord: this.isAddNewWord,
        },
        animationDirection: 'forward'
      });
    }
  }

  async prevCategory() {
    this.isLoading = true;
    this.arrayOfCategories.pop();
    if (this.arrayOfCategories.length === 0) {
      this.currentCategories = await this.categoryService.getMainCategories();
    } else {
      let lastCategory = await this.categoryService.getByUid(this.arrayOfCategories[this.arrayOfCategories.length - 1]);
      this.currentCategories = await this.categoryService.getByUids(lastCategory.subCategories);
    }
    this.isLoading = false;
  }
}
