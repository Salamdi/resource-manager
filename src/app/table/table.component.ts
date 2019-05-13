import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VolunteerAdapterService } from '../volunteer-adapter.service';
import { Volunteer, Gender } from '../models';

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
  }>

  constructor(
    private route: ActivatedRoute,
    private adapter: VolunteerAdapterService
  ) { }

  ngOnInit() {
    this.route.data.subscribe(({volunteers}) => this.generateTable(volunteers));
  }

  private generateTable(list: Array<Volunteer>): void {
    this.data = Array.from(this.adapter.daysMapper).map(([day, mask]) => {
      const boys = list.filter(volunteer => (volunteer.load & mask) && (volunteer.gender === Gender.male));
      const girls = list.filter(volunteer => (volunteer.load & mask) && (volunteer.gender === Gender.female));
      return {boys, girls, name: day};
    });
  }
}
