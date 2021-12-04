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
      if (data.patientRef && data.patientRef.ref) {
        data.patientId = data.patient.ref.id;
      }
      return data as Word;
    }
  }

  getFinalWords(id: string) {
    const query = this.collection.ref.where('categories', 'array-contains', id);

    return query.get().then(res => res.docs.map(category => this.mapModelToClient(category)));
  }

  // getWords(categories: Array<string>) {
  //   let query = this.collection.ref;
  //
  //   categories.forEach(category => {
  //     query = query.where('categories', 'array-contains', category);
  //   });
  //
  //   return query.get().then(res => res.docs.map(category => this.mapModelToClient(category)));
  // }
}
