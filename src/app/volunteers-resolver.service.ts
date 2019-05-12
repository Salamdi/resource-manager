import { Injectable } from '@angular/core';
import { VolunteerService } from './volunteer.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Volunteer } from './models';
import { Observable, of, EMPTY } from 'rxjs';
import { take, filter, mergeMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VolunteersResolverService implements Resolve<Array<Volunteer>> {

  constructor(
    private vs: VolunteerService,
    private router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<Volunteer> | never> {
    return this.vs.volunteersList$(127).pipe(
      take(1),
      mergeMap(list => {
        if (list.length) {
          return of(list);
        } else {
          this.router.navigateByUrl('/conf');
          return EMPTY
        }
      })
    );
  }
}
