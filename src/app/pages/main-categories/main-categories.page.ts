import { Component, OnInit } from '@angular/core';
import { Category } from '../../core/models/category.model';
import { WordService } from '../../core/services/word/word.service';
import { CategoryService } from '../../core/services/category/category.service';
import {NavController} from '@ionic/angular';
import {Router, ActivatedRoute, NavigationExtras} from '@angular/router';

@Component({
  selector: 'app-main-categories',
  templateUrl: './main-categories.page.html',
  styleUrls: ['./main-categories.page.scss'],
})
export class MainCategoriesPage implements OnInit {

  mainCategories: Array<Category>;
  isLoading: boolean;

  constructor(private wordService: WordService,
              private categoryService: CategoryService,
              private navController: NavController,
              private route: Router) {
  }

  async ngOnInit() {
    this.isLoading = true;
    this.mainCategories = await this.categoryService.getMainCategories();
    this.isLoading = false;
  }

  async goSubCategories(category: Category) {
    if (category.subCategories?.length > 0) {
      this.isLoading = true;
      this.mainCategories = await this.categoryService.getByUids(category.subCategories);
      this.isLoading = false;
    } else { //david
      //this.isLoading = true;
      // @ts-ignore
      //const navigationExtras: NavigationExtras = {categoryID: category.id};
      this.navController.navigateForward('words');
      //this.isLoading = false;


    }

  }
}
