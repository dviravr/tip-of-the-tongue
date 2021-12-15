export interface Category {
  id: string;
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
