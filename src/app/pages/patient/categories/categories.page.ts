import { Component, OnInit } from '@angular/core';
import { Category } from '../../../core/models/category.model';
import { WordService } from '../../../core/services/word/word.service';
import { CategoryService } from '../../../core/services/category/category.service';
import { NavController } from '@ionic/angular';
import { ReportService } from '../../../core/services/report/report.service';

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

  constructor(private wordService: WordService,
              private categoryService: CategoryService,
              private navController: NavController,
              private reportService: ReportService) {
  }

  async ngOnInit() {
    this.question = 'בחר קטגוריה ראשית';
    this.arrayOfCategories = [];
    this.isLoading = true;
    this.currentCategories = await this.categoryService.getMainCategories();
    this.isLoading = false;
    this.reportService.startTime = new Date();
  }

  async goSubCategories(category: Category) {
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
          question: category.subQuestion
        },
        animationDirection: 'forward'
      });
    }
  }
}
