import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { map, take } from 'rxjs/operators';
import { UserTypeEnum } from '../enum/userType.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private authService: AuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const requiredUserType = route.data.requiredUserType as UserTypeEnum;

    return this.authService.firebaseUser$.pipe(
      take(1),
      map(([firebaseUser, loggedInUser]) => {
        if (firebaseUser && !loggedInUser) {
          return this.router.createUrlTree(['/login/first-login']);
        } else if (firebaseUser && loggedInUser) {
          if (requiredUserType === loggedInUser.userType) {
            return true;
          }
          return this.router.createUrlTree([`/${loggedInUser.userType}`]);
        }
        if (!requiredUserType) {
          return true;
        }
        return this.router.createUrlTree(['/login']);
      })
    );
  }
}
