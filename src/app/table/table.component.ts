import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VolunteerAdapterService } from '../volunteer-adapter.service';
import { Volunteer, Gender } from '../models';
import { Location } from '@angular/common';

const defaultVolunteer = (gender: Gender, mask: number): Volunteer => ({
  id: -1,
  name: '',
  number: '',
  surname: '',
  gender,
  email: '',
  availability: mask,
  load: mask
})

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  data: Array<{
    name: string;
    boys: Array<Volunteer>;
    girls: Array<Volunteer>
  }>;
  boys: Array<Array<Volunteer>> = [];
  girls: Array<Array<Volunteer>> = [];
  days: Array<string> = [];
  showNumbers = false;

  constructor(
    private route: ActivatedRoute,
    private adapter: VolunteerAdapterService,
    private location: Location
  ) { }

  ngOnInit() {
    this.route.data.subscribe(({volunteers}) => this.generateTable(volunteers));
    this.days = Array.from(this.adapter.daysMapper.keys());
  }

  private generateTable(list: Array<Volunteer>): void {
    const data = Array.from(this.adapter.daysMapper).map(([day, mask]) => {
      const boys = list.filter(volunteer => (volunteer.load & mask) && (volunteer.gender === Gender.male));
      const girls = list.filter(volunteer => (volunteer.load & mask) && (volunteer.gender === Gender.female));
      return {boys, girls, name: day};
    });

    const maxBoys = data.reduce((max, day) => day.boys.length > max ? day.boys.length : max, 0);
    const maxGirls = data.reduce((max, day) => day.girls.length > max ? day.girls.length : max, 0);
    for (let i = 0; i < maxBoys; i++) {
      const row = [];
      for (let j = 0; j < data.length; j++) {
        const mask = this.adapter.daysMapper.get(data[j].name);
        const boy = data[j].boys[i] || defaultVolunteer(Gender.male, mask);
        row.push(boy);
      }
      this.boys.push(row);
    }

    for (let i = 0; i < maxGirls; i++) {
      const row = [];
      for (let j = 0; j < data.length; j++) {
        const mask = this.adapter.daysMapper.get(data[j].name);
        const girl = data[j].girls[i] || defaultVolunteer(Gender.female, mask);
        row.push(girl);
      }
      this.girls.push(row);
    }
  }

  public togglePhones(on: boolean): void {
    this.showNumbers = on;
  }

  public goBack(): void {
    this.location.back();
  }
}
