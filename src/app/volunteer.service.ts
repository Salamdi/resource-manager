import { Injectable } from '@angular/core';
import { Volunteer } from './models';
import { VolunteerAdapterService } from './volunteer-adapter.service';
import { of, Observable, BehaviorSubject, timer } from 'rxjs';
import { map, tap, catchError, filter } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class VolunteerService {
  private _volunteers$: BehaviorSubject<Array<Volunteer>>;
  private _volunteers: Array<Volunteer>;

  constructor(
    private adapter: VolunteerAdapterService,
    private api: ApiService
  ) {
    const json = localStorage.getItem('volunteers.list');
    this._volunteers = JSON.parse(json);
    this._volunteers$ = new BehaviorSubject(this._volunteers || []);
    this._volunteers$.asObservable().subscribe(volunteers => {
      if (volunteers.length) {
        this.persist();
      }
    });
  }

  public volunteersList(daymask: number): Observable<Array<Volunteer>> {
    return this._volunteers$.asObservable().pipe(
      map(volunteers => {
        return volunteers
          .filter(volunteer => volunteer.availability & daymask)
      })
    );
  }

  public load(id: number, daymask: number) {
    this._volunteers = this._volunteers.map(volunteer => {
      if (volunteer.id === id) {
        let { load } = volunteer;
        load += daymask;
        return { ...volunteer, load };
      }
      return volunteer;
    });
    this._volunteers$.next(this._volunteers);
  }

  public unload(id: number, daymask: number): void {
    this._volunteers = this._volunteers.map(volunteer => {
      if (volunteer.id === id) {
        let { load } = volunteer;
        load -= daymask;
        return { ...volunteer, load };
      }
      return volunteer;
    });
    this._volunteers$.next(this._volunteers);
  }

  public persist(): void {
    const json = JSON.stringify(this._volunteers);
    localStorage.setItem('volunteers.list', json);
  }

  public fetchNewList(id: string, range: string, sheet?: string): void {
    this.api.getData(id, range, sheet).pipe(
      map(data => this.adapter.adapt(data)),
      catchError(error => {
        console.error(error);
        return of([]);
      }),
      tap(volunteers => this._volunteers = volunteers),
    ).subscribe(volunteers => this._volunteers$.next(volunteers))
  }
}
