import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { FirestoreReportSearch, ReportSearch } from '../../models/report.model';
import { GenericModelService } from '../generic-model/generic-model.service';
import { CollectionEnum } from '../../enum/collections.enum';
import { User } from '../../models/user.model';
import { Word } from '../../models/word.model';
import * as moment from 'moment';
import { UserService } from '../user/user.service';
import { WordService } from '../word/word.service';
import { Category } from '../../models/category.model';
import { CategoryService } from '../category/category.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService extends GenericModelService<ReportSearch, FirestoreReportSearch> {

  startTime: Date;
  endTime: Date;

  constructor(protected angularFirestore: AngularFirestore,
              private userService: UserService,
              private categoryService: CategoryService,
              private wordService: WordService) {
    super(angularFirestore, CollectionEnum.reports);
  }


  async mapModelToClient(doc: QueryDocumentSnapshot<DocumentData>): Promise<ReportSearch> {
    const report = doc.data();
    if (report) {
      // @ts-ignore
      report.id = doc.id;
      if (report.patientRef) {
        report.patientId = report.patientRef.id;
      }
      if (report.wordRef) {
        report.word = await this.wordService.getByUid(report.wordRef.id);
      }
      if (report.mainCategoryRef) {
        report.mainCategory = await this.categoryService.getByUid(report.mainCategoryRef.id);
      }
      delete report.wordRef;
      delete report.patientRef;
      return report as ReportSearch;
    }
  }

  async getWordsReport(userId: string): Promise<Map<string, { word: Word; counter: number; avgTime: number }>> {
    const reports: Array<ReportSearch> = await Promise.all(await this.getAllReportsFromFirebase(userId));
    const reportMap: Map<string, { word: Word; counter: number; avgTime: number }> = new Map();
    reports.forEach(report => {
      const word = reportMap.get(report.word.id);
      if (!word) {
        reportMap.set(report.word.id, { word: report.word, counter: 1, avgTime: report.searchTime });
      } else {
        const newAvg = ((word.avgTime * word.counter) + report.searchTime) / (word.counter + 1);
        reportMap.set(report.word.id, { word: report.word, counter: word.counter + 1, avgTime: newAvg });
      }
    });
    return reportMap;
  }

  async getCategoriesReport(userId: string) {
    const reports: Array<ReportSearch> = await Promise.all(await this.getAllReportsFromFirebase(userId));
    const reportMap: Map<string, { mainCategory: Category, wordsCounter: number }> = new Map();
    reports.forEach(report => {
      const mainCategory = reportMap.get(report.mainCategory.id);
      if (!mainCategory) {
        reportMap.set(report.mainCategory.id, { mainCategory: report.mainCategory, wordsCounter: 1 });
      } else {
        reportMap.set(report.word.id, {
          mainCategory: report.mainCategory,
          wordsCounter: mainCategory.wordsCounter + 1
        });
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
    return { wordsCounter: reports.length, avgTime };
  }

  async getAllReportsFromFirebase(userId: string) {
    const userRef = await this.userService.getReferenceByUid(userId);
    const query = this.collection.ref.where('patientRef', '==', userRef);
    return query.get().then(res => res.docs.map(report => this.mapModelToClient(report)));
  }

  async createNewReport(loggedInUser: User, word: Word, mainCategoryId: string) {
    const report: FirestoreReportSearch = {
      patientRef: await this.userService.getReferenceByUid(loggedInUser.id),
      mainCategoryRef: await this.categoryService.getReferenceByUid(mainCategoryId),
      wordRef: await this.wordService.getReferenceByUid(word.id),
      searchTime: moment.duration(this.endTime.getTime() - this.startTime.getTime()).as('seconds')
    };
    await this.create(report);
  }
}
