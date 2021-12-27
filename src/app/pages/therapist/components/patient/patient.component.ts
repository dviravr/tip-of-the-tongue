import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../../core/models/user.model';
import { ModalController } from '@ionic/angular';
import { Word } from '../../../../core/models/word.model';
import { ReportService } from '../../../../core/services/report/report.service';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss'],
})
export class PatientComponent implements OnInit {
  @Input() patient: User;
  report: Map<string, { word: Word; counter: number; avgTime: number }>;

  constructor(
    public modalController: ModalController,
    private reportService: ReportService
  ) {
  }

  async ngOnInit() {
    this.report = await this.reportService.getReport(this.patient.id);
  }

}
