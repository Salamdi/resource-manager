import { Injectable } from '@angular/core';
import { Gender, Volunteer } from './models';
import { format } from 'src/utils/phone-formatter';

@Injectable({
  providedIn: 'root'
})
export class VolunteerAdapterService {
  private _daysMapper: Map<string, number>;

  constructor() {
    const json = localStorage.getItem('volunteers.daysMapper');
    this._daysMapper = new Map(JSON.parse(json));
  }

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
    localStorage.setItem('volunteers.daysMapper', JSON.stringify(week));
    this._daysMapper = new Map(week);
    let volunteers = list.map((volunteer, id) => {
      volunteer = volunteer.map(field => field.trim());
      const [surname, name, unformattedNumber, email, daysList] = volunteer;
      const number = format(unformattedNumber);
      const gender = surname.charCodeAt(surname.length - 1) === 1072 ? Gender.female : Gender.male;
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
    volunteers = volunteers.filter((volunteer, i) => {
      const tail = volunteers.slice(i + 1);
      const clone = tail.find(volClone => `${volClone.surname}${volClone.name}` === `${volunteer.surname}${volunteer.name}`);
      return !clone;
    });
    return volunteers;
  }
}
