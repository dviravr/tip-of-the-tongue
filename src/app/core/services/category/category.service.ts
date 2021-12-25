import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { GenericModelService } from '../generic-model/generic-model.service';
import { CollectionEnum } from '../../enum/collections.enum';
import { Category, FirestoreCategory } from '../../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends GenericModelService<Category, FirestoreCategory> {

  constructor(protected angularFirestore: AngularFirestore) {
    super(angularFirestore, CollectionEnum.categories);
  }

  mapModelToClient(doc: QueryDocumentSnapshot<DocumentData>): Category {
    const data = doc.data();
    if (data) {
      // @ts-ignore
      data.id = doc.id;
      return data as Category;
    }
  }

  getMainCategories() {
    const query = this.collection.ref.where('isMainCategory', '==', true);
    return query.get().then(res => res.docs.map(category => this.mapModelToClient(category)));
  }
}
