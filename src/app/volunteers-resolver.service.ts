import { Injectable } from '@angular/core';
import { VolunteerService } from './volunteer.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Volunteer } from './models';
import { Observable, of } from 'rxjs';
import { take, mergeMap, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VolunteersResolverService implements Resolve<Array<Volunteer>> {

  constructor(
    private volunteer: VolunteerService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<Volunteer>> {
    return this.volunteer.volunteersList(127).pipe(
      filter(list => list.length > 0),
      take(1)
    );
  }
}
