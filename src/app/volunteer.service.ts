import { Injectable } from '@angular/core';
import { Volunteer } from './models';
import { VolunteerAdapterService } from './volunteer-adapter.service';
import { VOLUNTEERS } from './mock-data';
import { of, Observable, BehaviorSubject, timer } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VolunteerService {
  private _volunteers$: BehaviorSubject<Array<Volunteer>>;
  private _volunteers: Array<Volunteer>;

  constructor(private adapter: VolunteerAdapterService) {
    this._volunteers$ = new BehaviorSubject([]);
  }

  public volunteersList(daymask: number): Observable<Array<Volunteer>> {
    if (!this._volunteers) {
      timer(1400).pipe(
        map(() => VOLUNTEERS),
        map(volunteers => this.adapter.adapt(volunteers)),
        tap(volunteers => this._volunteers = volunteers),
      ).subscribe(volunteers => this._volunteers$.next(volunteers));
    }
    return this._volunteers$.asObservable().pipe(
      map(volunteers => volunteers
        .filter(volunteer => volunteer.availability & daymask))
    );
  }
  
  public load(id: number, daymask: number) {
    this._volunteers = this._volunteers.map(volunteer => {
      if (volunteer.id === id) {
        let {load} = volunteer;
        load += daymask;
        return {...volunteer, load};
      }
      return volunteer;
    });
    this._volunteers$.next(this._volunteers);
  }

  public unload(id: number, daymask: number): void {
    this._volunteers = this._volunteers.map(volunteer => {
      if (volunteer.id === id) {
        let {load} = volunteer;
        load -= daymask;
        return {...volunteer, load};
      }
      return volunteer;
    });
    this._volunteers$.next(this._volunteers);
  }
}
