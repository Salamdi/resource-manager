import { Injectable } from '@angular/core';
import { Volunteer } from './models';
import { VolunteerAdapterService } from './volunteer-adapter.service';
import { VOLUNTEERS } from './mock-data';
import { of, Observable, BehaviorSubject, timer } from 'rxjs';
import { map, tap, catchError, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VolunteerService {
  private _volunteers$: BehaviorSubject<Array<Volunteer>>;
  private _volunteers: Array<Volunteer>;

  constructor(private adapter: VolunteerAdapterService) {
    this._volunteers$ = new BehaviorSubject([]);
    this._volunteers$.asObservable().subscribe(volunteers => {
      if (volunteers.length) {
        this.persist(volunteers);
      }
    })
  }

  public volunteersList(daymask: number): Observable<Array<Volunteer>> {
    if (!this._volunteers) {
      timer(1400).pipe(
        map(_ => localStorage.getItem('volunteers.list')),
        map(json => json ? JSON.parse(json) : this.adapter.adapt(VOLUNTEERS)),
        catchError(_ => of(this.adapter.adapt(VOLUNTEERS))), // TODO: add error handler
        tap(volunteers => this._volunteers = volunteers),
      ).subscribe(volunteers => this._volunteers$.next(volunteers));
    }
    return this._volunteers$.asObservable().pipe(
      filter(list => !!list.length),
      map(volunteers => {
        return volunteers
        .filter(volunteer => volunteer.availability & daymask)
      })
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

  private persist(data: any): void {
    const json = JSON.stringify(data);
    localStorage.setItem('volunteers.list', json);
  }
}
