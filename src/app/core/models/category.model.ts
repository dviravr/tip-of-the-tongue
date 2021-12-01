import { BaseModel } from './base.model';

export interface Category extends BaseModel {
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
