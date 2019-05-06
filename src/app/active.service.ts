import { Injectable } from '@angular/core';
import { VolunteerService } from './volunteer.service';
import { VolunteerAdapterService } from './volunteer-adapter.service';
import { Volunteer } from './models';

@Injectable({
  providedIn: 'root'
})
export class ActiveService {
  private _activeList: Array<Array<Volunteer>>;

  constructor(
    private volunteer: VolunteerService,
    private adapter: VolunteerAdapterService
  ) {
    this._activeList = Array.from(this.adapter.daysMapper)
      .map(([day, mask]) => []);
  }
}
