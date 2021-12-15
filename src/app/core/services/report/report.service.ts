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
        report.patientID = report.patientRef.id;
      }
      if (report.wordRef) {
        report.wordId = await this.getByUid(report.wordRef.id);
      }
      delete report.wordRef;
      delete report.patientRef;
      return report as ReportSearch;
    }
  }

  async getReport(userId: string): Promise<Map<Word, { counter: number; avgTime: number }>> {
    const reports: Array<ReportSearch> = await Promise.all(await this.getAllReportsFromFirebase(userId));
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

  async getShortReport(userId: string) {
    const reports: Array<ReportSearch> = await Promise.all(await this.getAllReportsFromFirebase(userId));
    let totTime = 0;
    reports.forEach(report => {
      totTime += report.searchTime;
    });
    const avgTime = totTime / reports.length;
    return { wordsCounter: reports.length, avgTime: avgTime };
  }

  async getAllReportsFromFirebase(userId: string) {
    const userRef = await this.getReferenceByUid(userId);
    const query = this.collection.ref.where('patientRef', '==', userRef);
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
