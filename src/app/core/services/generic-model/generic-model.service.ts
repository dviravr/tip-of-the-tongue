import {
  AngularFirestoreCollection,
  AngularFirestore,
  DocumentData,
  DocumentReference,
  QueryDocumentSnapshot,
  QuerySnapshot
} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';

export abstract class GenericModelService<T, S> {
  protected collection: AngularFirestoreCollection<S>;
  private cachedRefs: {
    [key: string]: DocumentReference<S>;
  } = {};

  protected constructor(protected angularFirestore: AngularFirestore, collectionName: string) {
    this.collection = angularFirestore.collection<S>(collectionName);
  }

  subscribeById(id: string): Observable<T> {
    return new Observable<T>(observer => {
      this.collection.doc(id).snapshotChanges().subscribe(res => {
        observer.next(this.mapModelToClient(res.payload) as T);
      });
    });
  }

  // return document by uid
  async getByUid(uid: string): Promise<T> {
    return this.collection.doc(uid).get().toPromise().then((doc) => this.mapModelToClient(doc));
  }

  // return documents by uids
  async getByUids(uidArr: string[]): Promise<Array<T>> {
    const subArrays: Array<Array<string>> = [];
    for (let i = 0; i < uidArr.length; i += 10) {
      subArrays.push(uidArr.slice(i, i + 10));
    }
    const promises: Array<Promise<QuerySnapshot<DocumentData>>> = [];
    subArrays.forEach((array) => {
      promises.push(this.collection.ref.where(firebase.firestore.FieldPath.documentId(), 'in', array).get());
    });

    return Promise.all(promises).then(async (values) => {
      let allDocs = [];
      for (const value of values) {
        allDocs = allDocs.concat(value.docs);
      }
      return await Promise.all(allDocs.map(async (doc) => this.mapModelToClient(doc)));
    });
  }

  // return all documents in the collection
  async getAll(): Promise<Array<T>> {
    return await this.collection.get().toPromise()
      .then(async (allDocuments) => await Promise
        .all(allDocuments.docs.map(async (doc) => this.mapModelToClient(doc))));
  }

  update(uid: string, newData: Partial<S>): Promise<void> {
    return this.collection.doc(uid).update(newData);
  }

  getReferenceByUid(uid: string): Promise<DocumentReference<S>> {
    if (uid) {
      const ref = this.cachedRefs[uid];

      if (!ref) {
        const doc = this.collection.doc(uid);
        this.cachedRefs[uid] = doc.ref;

        return new Promise((resolve, reject) => {
          resolve(doc.ref);
        });
      }

      return new Promise((resolve, reject) => {
        resolve(ref);
      });
    }
  }

  async getReferencesByUids(uidArr: string[]) {
    const promises: Promise<DocumentReference<S>>[] = [];

    uidArr.forEach((uid) => {
      const ref = this.cachedRefs[uid];
      if (ref) {
        promises.push(new Promise((resolve, reject) => {
          resolve(ref);
        }));
      } else {
        promises.push(new Promise((resolve, reject) => {
          resolve(this.collection.doc(uid).ref);
        }));
      }
    });

    return Promise.all(promises).then(async (values) => values);
  }

  async create(data, id?: string): Promise<T> {
    const now = new Date();
    data.updateDate = now;
    data.createDate = now;
    if (id) {
      await this.collection.doc(id).set(data);
      return await this.getByUid(id);
    } else {
      const ref: any = await this.collection.add(data);
      return await this.getByUid(ref.id);
    }
  }

  async createAll(allData: Array<S>): Promise<Array<T>> {
    const now = new Date();
    allData.map(data => ({
      ...data,
      createDate: now,
      updateDate: now,
    }));
    const ids: Array<string> = [];
    for (const data of allData) {
      const ref: any = await this.collection.add(data);
      ids.push(ref.id);
    }
    return await this.getByUids(ids);
  }

  async deleteByRefs(refs: DocumentReference[]): Promise<void> {
    const batch = this.angularFirestore.firestore.batch();
    refs.forEach((ref) => {
      batch.delete(ref);
    });

    return batch.commit();
  }

  /**
   * Checks if and object is Document in firestore
   *
   * @param object - The tested object
   * @returns true for firestore doc, false for others
   */
  documentTypeGuard(object: any): boolean {
    return !!(object && (object as DocumentReference).id);
  }

  abstract mapModelToClient(documentSnapshot: QueryDocumentSnapshot<DocumentData>): T | Promise<T>;
}
