import { Injectable } from '@angular/core';
import { Volunteer, Gender } from './models';
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

  public volunteersList$(daymask: number): Observable<Array<Volunteer>> {
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

  public processSingleDayVolunteers(): void {
    this._volunteers = this._volunteers
      .map(volunteer => {
        const { availability, load } = volunteer;
        const power = Math.log2(availability);
        const singleDay = Number.isInteger(power);
        const free = !load;
        if (singleDay && free) {
          const load = availability;
          return { ...volunteer, load };
        }
        return volunteer;
      });
  }

  public processAllVolunteers(): void {
    this.processSingleDayVolunteers();
    this.adapter.daysMapper.forEach(mask => {
      this.fillDay(mask, Gender.male);
      this.fillDay(mask, Gender.female);
    });
    this._volunteers = this._volunteers.map(volunteer => {
      if (volunteer.load !== 0) {
        return volunteer;
      }
      const load = Array.from(this.adapter.daysMapper.values()).find(mask => !!(volunteer.availability & mask));
      return {...volunteer, load};
    })
    this._volunteers$.next(this._volunteers);
  }

  private fillDay(mask: number, gender: Gender): void {
    let n = this._volunteers.filter(volunteer => volunteer.gender === gender && volunteer.load === mask).length;
    while (n < 10) {
      // available volunteers
      const availables = this._volunteers
        .filter(volunteer =>
          (volunteer.gender === gender) && (volunteer.availability & mask) && !(volunteer.load & mask))
        .sort((a, b) => {
          const aDays = Array.from(this.adapter.daysMapper).reduce((n, [_, mask]) => (a.load & mask) ? n + 1 : n, 0);
          const bDays = Array.from(this.adapter.daysMapper).reduce((n, [_, mask]) => (b.load & mask) ? n + 1 : n, 0);
          return aDays - bDays;
        });
      // take volunteer least loaded (potentially not loaded yet if load === 0)
      let candidate = availables[0];
      // if  no candidate stop looping
      if (!candidate) {
        break;
      }
      // add load to candidate
      this.load(candidate.id, mask);
      n++;
    }
  }

  public reset(): void {
    this._volunteers = this._volunteers.map(volunteer => ({...volunteer, load: 0}));
    this._volunteers$.next(this._volunteers);
  }

  public unprocessed$(): Observable<boolean> {
    return this._volunteers$.asObservable().pipe(map(list => list.every(volunteer => volunteer.load === 0)))
  }

  public removeVolunteer(id: number): void {
    this._volunteers = this._volunteers.filter(volunteer => volunteer.id !== id);
    this._volunteers$.next(this._volunteers);
  }

  public drop(): void {
    this._volunteers = [];
    localStorage.removeItem('volunteers.list');
    this._volunteers$.next(this._volunteers);
  }
}
