import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../store/types';
import { User } from '../models/user.model';
import { map } from 'rxjs/operators';


@Injectable({providedIn: 'root'})

export class RoleGuardService implements CanActivate {

  user: Observable<null | User>

  constructor(private store: Store<AppState>, private router: Router) {
    this.user = store.select(state => state.users.user);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const roles: string[] = route.data['roles'];

    return this.user.pipe(
      map(user => {
        if (user && roles.includes(user.role)) {
          return true;
        }

        void this.router.navigate(['/login']);

        return false;
      })
    );
  }
}
