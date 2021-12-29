import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../../core/models/user.model';
import { ModalController } from '@ionic/angular';
import { Word } from '../../../../core/models/word.model';
import { ReportService } from '../../../../core/services/report/report.service';
import { Category } from '../../../../core/models/category.model';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss'],
})
export class PatientComponent implements OnInit {
  @Input() patient: User;
  wordsReport: Map<string, { word: Word; counter: number; avgTime: number }>;
  categoriesReport: Map<string, { mainCategory: Category, wordsCounter: number }>;
  isLoading: boolean;
  reportType: 'words' | 'categories' = 'words';

  constructor(
    public modalController: ModalController,
    private reportService: ReportService
  ) {
  }

  async ngOnInit() {
    this.isLoading = true;
    this.wordsReport = await this.reportService.getWordsReport(this.patient.id);
    this.categoriesReport = await this.reportService.getCategoriesReport(this.patient.id);
    this.isLoading = false;
  }
}
