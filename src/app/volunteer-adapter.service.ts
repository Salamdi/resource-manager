import { Injectable } from '@angular/core';
import { Gender, Volunteer } from './models';

@Injectable({
  providedIn: 'root'
})
export class VolunteerAdapterService {
  private _daysMapper: Map<string, number>;

  constructor() { }

  get daysMapper(): Map<string, number> {
    return this._daysMapper;
  }

  get allDaysMask(): number {
    return Array
      .from(this._daysMapper.values())
      .reduce((mask, curr) => mask + curr);
  }

  public adapt(list: Array<Array<string>>): Array<Volunteer> {
    const fullyAvailable = list.find(volunteer => volunteer[4].split(', ').length === 7);
    const week = fullyAvailable[4]
      .split(', ')
      .map<[string, number]>((day, index) => [day, 2 ** index]);
    this._daysMapper = new Map(week);
    return list.map((volunteer, id) => {
      const [surname, name, number, email, daysList, stringGender] = volunteer;
      const gender = stringGender === 'male' ? Gender.male : Gender.female;
      const availability = daysList.split(', ').reduce((mask, curr) => mask + this._daysMapper.get(curr), 0);
      const load = 0;
      return {
        name,
        surname,
        number,
        email,
        availability,
        gender,
        load,
        id
      };
    });
  }
}
