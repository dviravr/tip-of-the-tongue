import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { switchMap, take } from 'rxjs/operators';
import { UserTypeEnum } from '../enum/userType.enum';
import { UserService } from '../services/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private userService: UserService,
              private authService: AuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const requiredUserType = route.data.requiredUserType as UserTypeEnum;

    return this.authService.firebaseUser$.pipe(
      take(1),
      switchMap(async (firebaseUser) => {
        if (firebaseUser) {
          const loggedInUser = await this.userService.getByUid(firebaseUser.uid);
          if (loggedInUser) {
            if (requiredUserType === loggedInUser.userType) {
              return true;
            }
            return this.router.createUrlTree([`${loggedInUser.userType}`]);
          } else {
            return this.router.createUrlTree(['first-login']);
          }
        }
        if (!requiredUserType) {
          return true;
        }
        return this.router.createUrlTree(['login']);
      })
    )
  }
}
