import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { CollectionEnum } from '../../enum/collections.enum';
import { FirestoreWord, Word } from '../../models/word.model';
import { GenericModelService } from '../generic-model/generic-model.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class WordService extends GenericModelService<Word, FirestoreWord> {

  constructor(protected angularFirestore: AngularFirestore,
              private userService: UserService) {
    super(angularFirestore, CollectionEnum.words);
  }

  mapModelToClient(doc: QueryDocumentSnapshot<DocumentData>): Word {
    const data = doc.data();
    if (data) {
      // @ts-ignore
      data.id = doc.id;
      if (data.patientRef) {
        data.patientId = data.patientRef.id;
      }
      delete data.patientRef;
      return data as Word;
    }
  }

  async getFinalWords(categoriesIds: Array<string>, patientId: string): Promise<Array<Word>> {
    const patientRef = await this.userService.getReferenceByUid(patientId);
    if (categoriesIds?.length > 0) {
      let patientQuery = this.collection.ref.where('patientRef', '==', patientRef);
      let systemQuery = this.collection.ref.where('patientRef', '==', null);
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < categoriesIds.length; i++) {
        systemQuery = systemQuery.where(`categories.${ categoriesIds[i] }`, '==', true);
        patientQuery = patientQuery.where(`categories.${ categoriesIds[i] }`, '==', true);
      }

      return Promise.all([patientQuery.get(), systemQuery.get()]).then((res) => {
        let words = res[0].docs.map(word => this.mapModelToClient(word));
        words = words.concat(res[1].docs.map(word => this.mapModelToClient(word)));
        return words;
      });
    }
  }

  async addNewWord(word: string, categoriesIds: Array<string>, patientId: string) {
    const categories: { [key: string]: boolean } = {};
    categoriesIds.forEach(category => {
      categories[category] = true;
    });
    const patientRef = await this.userService.getReferenceByUid(patientId);
    const newWord: FirestoreWord = {
      word,
      categories,
      patientRef
    };
    await this.create(newWord);
  }

  // async updateAllToNull() {
  //   let allWords = await this.getAll();
  //   allWords.forEach(word => {
  //     this.update(word.id, { patientRef: null });
  //   })
  // }
}
