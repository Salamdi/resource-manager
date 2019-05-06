import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VolunteerAdapterService } from '../volunteer-adapter.service';
import { Volunteer } from '../models';
import { VolunteerService } from '../volunteer.service';
import { map, tap, mergeMap } from 'rxjs/operators';
import { ToggleEvent } from '../available-item/available-item.component';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent implements OnInit {
  public days: Array<{ day: string, id: number }> = [];
  public availableList: Array<Volunteer>;
  public activeList: Array<Volunteer>;
  public currentday: number;
  public daymask: number;

  constructor(
    private route: ActivatedRoute,
    private adapter: VolunteerAdapterService,
    private vs: VolunteerService
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      map(params => parseInt(params.get('mask'), 10)),
      tap(currentday => this.currentday = currentday),
      map(currentday => currentday - 1),
      map(power => Math.pow(2, power)),
      tap(daymask => this.daymask = daymask),
      mergeMap(daysmask => this.vs.volunteersList(daysmask))
    ).subscribe(list => {
      this.availableList = list;
      this.activeList = list.filter(volunteer => volunteer.load & this.daymask)
      this.days = Array.from(this.adapter.daysMapper.entries())
        .map(([day, mask]) => {
          const id = Math.log2(mask) + 1;
          return { day, id };
        });
    });
  }

  public onToggleVolunteer({ checked, id }: ToggleEvent): void {
    if (checked) {
      this.vs.load(id, this.daymask);
    } else {
      this.vs.unload(id, this.daymask);
    }
  }

  public onRemoveItem(id: number): void {
    const checked = false;
    this.onToggleVolunteer({checked, id});
  }
}
