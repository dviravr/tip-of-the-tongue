import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { User } from '../../../core/models/user.model';
import { take } from 'rxjs/operators';
import { UserService } from '../../../core/services/user/user.service';

@Component({
  selector: 'app-my-patients',
  templateUrl: './my-patients.page.html',
  styleUrls: ['./my-patients.page.scss'],
})
export class MyPatientsPage implements OnInit {

  loggedInUser: User;
  myPatients: Array<User>;

  constructor(private authService: AuthService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.authService.loggedInUser$.pipe(take(1)).subscribe(async (user) => {
      this.loggedInUser = user;
      if (user.patientsIds?.length > 0) {
        this.myPatients = await this.userService.getByUids(user.patientsIds);
      }
    });
  }


}
