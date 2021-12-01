import { Component, OnInit } from '@angular/core';
import { WordService } from '../core/services/word/word.service';
import { CategoryService } from '../core/services/category/category.service';
import { Category } from '../core/models/category.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  mainCategories: Array<Category>;

  constructor(private wordService: WordService,
              private categoryService: CategoryService) {
  }

  async ngOnInit() {
    this.mainCategories = await this.categoryService.getMainCategories();
  }
}
