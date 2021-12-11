import { Component, OnInit } from '@angular/core';
import { Category } from '../../../core/models/category.model';
import { WordService } from '../../../core/services/word/word.service';
import { CategoryService } from '../../../core/services/category/category.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss']
})
export class CategoriesPage implements OnInit {

  currentCategories: Array<Category>;
  isLoading: boolean;
  arrayOfCategories: Array<string>;

  constructor(private wordService: WordService,
              private categoryService: CategoryService,
              private navController: NavController) {
  }

  async ngOnInit() {
    this.arrayOfCategories = [];
    this.isLoading = true;
    this.currentCategories = await this.categoryService.getMainCategories();
    this.isLoading = false;
  }

  async goSubCategories(category: Category) {
    this.arrayOfCategories.push(category.id);
    if (category.subCategories?.length > 0) {
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
