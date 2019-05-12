import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { VolunteerService } from './volunteer.service';
import { map, mergeMap, tap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthResolverService implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router,
    private vs: VolunteerService
  ) { }

  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.vs.volunteersList$(127).pipe(
      map(list => list.length === 0),
      mergeMap(isEmptyList => of(isEmptyList && !this.auth.verify())),
      tap(can => {
        if (!can) {
          this.router.navigateByUrl('/conf');
        }
      })
    )
  }
}
