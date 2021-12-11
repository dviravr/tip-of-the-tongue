import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { FirestoreReportSearch, ReportSearch } from '../../models/report.model';
import { GenericModelService } from '../generic-model/generic-model.service';
import { CollectionEnum } from '../../enum/collections.enum';
import { User } from '../../models/user.model';
import { Word } from '../../models/word.model';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ReportService extends GenericModelService<ReportSearch, FirestoreReportSearch> {

  startTime: Date;
  endTime: Date;

  constructor(protected angularFirestore: AngularFirestore) {
    super(angularFirestore, CollectionEnum.reports);
  }


  async mapModelToClient(doc: QueryDocumentSnapshot<DocumentData>): Promise<ReportSearch> {
    const report = doc.data();
    if (report) {
      // @ts-ignore
      report.id = doc.id;
      if (report.patientRef) {
        report.patientID = report.patientRef.ref.id;
      }
      if (report.wordRef) {
        report.wordId = await this.getByUid(report.wordRef);
      }
      delete report.wordRef;
      delete report.patientRef;
      return report as ReportSearch;
    }
  }

  async getReport(user: User): Promise<Map<Word, { counter: number; avgTime: number }>> {
    const reports: Array<ReportSearch> = await this.getAllReportsFromFirebase(user.id);
    const reportMap: Map<Word, { counter: number; avgTime: number }> = new Map();
    reports.forEach(report => {
      const word = reportMap.get(report.word);
      if (!word) {
        reportMap.set(report.word, { counter: 1, avgTime: report.searchTime });
      } else {
        const newAvg = ((word.avgTime * word.counter) + report.searchTime) / word.counter + 1;
        reportMap.set(report.word, { counter: word.counter + 1, avgTime: newAvg });
      }
    });
    return reportMap;
  }

  async getAllReportsFromFirebase(userId: string) {
    const userRef = await this.getReferenceByUid(userId);
    const query = this.collection.ref.where('patientRef', '==', userRef.id);
    return query.get().then(res => res.docs.map(report => this.mapModelToClient(report)));
  }

  async createNewReport(loggedInUser: User, word: Word) {
    const report: FirestoreReportSearch = {
      patientRef: await this.getReferenceByUid(loggedInUser.id),
      wordRef: await this.getReferenceByUid(word.id),
      searchTime: moment.duration(this.endTime.getTime() - this.startTime.getTime()).as('seconds')
    };
    this.create(report);
  }


}
