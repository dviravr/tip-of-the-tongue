import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { switchMap, take } from 'rxjs/operators';
import { UserService } from '../services/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class FirstLoginGuard implements CanActivate {

  constructor(private router: Router,
              private userService: UserService,
              private authService: AuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.authService.firebaseUser$.pipe(
      take(1),
      switchMap(async (firebaseUser) => {
        if (firebaseUser) {
          const loggedInUser = await this.userService.getByUid(firebaseUser.uid);
          if (!loggedInUser) {
            return true;
          }
        }
        return this.router.createUrlTree(['login']);
      })
    )
  }
}
