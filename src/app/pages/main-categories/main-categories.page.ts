import { Component, OnInit } from '@angular/core';
import { Category } from '../../core/models/category.model';
import { WordService } from '../../core/services/word/word.service';
import { CategoryService } from '../../core/services/category/category.service';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-main-categories',
  templateUrl: './main-categories.page.html',
  styleUrls: ['./main-categories.page.scss'],
})
export class MainCategoriesPage implements OnInit {

  mainCategories: Array<Category>;
  isLoading: boolean;
  arrayOfCategory: Array<string>;

  constructor(private wordService: WordService,
              private categoryService: CategoryService,
              private navController: NavController              ) {
  }

  async ngOnInit() {
    this.arrayOfCategory=[];
    this.isLoading = true;
    this.mainCategories = await this.categoryService.getMainCategories();
    this.isLoading = false;
  }

  async goSubCategories(category: Category) {
    this.arrayOfCategory.push(category.id);
    if (category.subCategories?.length > 0) {
      this.isLoading = true;
      this.mainCategories = await this.categoryService.getByUids(category.subCategories);
      this.isLoading = false;
    }else{

      this.navController.navigateRoot('words',{state:{categoryID: this.arrayOfCategory,question: category.subQuestion}});

    }
  }
}
