import { BaseModel } from './base.model';

export interface Category extends BaseModel {
  word: any;
  categoryName: string;
  subCategories: Array<string>;
  isMainCategory: boolean;
  subQuestion: string;
}

export interface FirestoreCategory {
  categoryName: string;
  subCategories: Array<string>;
  isMainCategory: boolean;
  subQuestion: string;
}
