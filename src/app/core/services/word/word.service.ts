import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { CollectionEnum } from '../../enum/collections.enum';
import { FirestoreWord, Word } from '../../models/word.model';
import { GenericModelService } from '../generic-model/generic-model.service';

@Injectable({
  providedIn: 'root'
})
export class WordService extends GenericModelService<Word, FirestoreWord> {

  constructor(protected angularFirestore: AngularFirestore) {
    super(angularFirestore, CollectionEnum.words);
  }

  mapModelToClient(doc: QueryDocumentSnapshot<DocumentData>): Word {
    const data = doc.data();
    if (data) {
      // @ts-ignore
      data.id = doc.id;
      if (data.patientRef) {
        data.patientId = data.patient.id;
      }
      delete data.patientRef;
      return data as Word;
    }
  }

  getFinalWords(categoriesIds: Array<string>) {
    if (categoriesIds?.length > 0) {
      let query = this.collection.ref.where(`categories.${ categoriesIds[0] }`, '==', true);
      for (let i = 1; i < categoriesIds.length; i++) {
        query = query.where(`categories.${ categoriesIds[i] }`, '==', true);
      }
      return query.get().then(res => res.docs.map(category => this.mapModelToClient(category)));
    }
  }
}
