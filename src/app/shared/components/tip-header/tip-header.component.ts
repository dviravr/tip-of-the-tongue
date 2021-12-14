import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth/auth.service';
import { NavController } from '@ionic/angular';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-tip-header',
  templateUrl: './tip-header.component.html',
  styleUrls: ['./tip-header.component.scss']
})
export class TipHeaderComponent implements OnInit {

  @Input() headerText: string;

  loggedInUser: User;

  constructor(private authService: AuthService,
              private navController: NavController) {
  }

  ngOnInit() {
    this.authService.loggedInUser$.pipe(take(1)).subscribe((user) => {
      this.loggedInUser = user;
    });
  }

  goHome() {
    this.navController.navigateRoot(`/${this.loggedInUser.userType}/home`);
  }
}
