import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VolunteerAdapterService } from '../volunteer-adapter.service';
import { Volunteer } from '../models';
import { VolunteerService } from '../volunteer.service';
import { map, tap, mergeMap, takeUntil } from 'rxjs/operators';
import { ToggleEvent } from '../available-item/available-item.component';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent implements OnInit, OnDestroy {
  public days: Array<{ day: string, id: number }> = [];
  public availableList: Array<Volunteer>;
  public activeList: Array<Volunteer>;
  public currentday: number;
  public currentgender: number;
  public daymask: number;
  private _destroy$ = new Subject<void>();
  public unprocessed: boolean;

  constructor(
    private route: ActivatedRoute,
    private adapter: VolunteerAdapterService,
    private vs: VolunteerService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      map(params => {
        const currentday = parseInt(params.get('mask'), 10);
        const currentgender = parseInt(params.get('gender'), 10);
        this.currentday = currentday;
        this.currentgender = currentgender;
        this.checkDay(currentday);
        return currentday;
      }),
      map(currentday => currentday - 1),
      map(power => Math.pow(2, power)),
      tap(daymask => this.daymask = daymask),
      mergeMap(daysmask => this.vs.volunteersList$(daysmask)),
      takeUntil(this._destroy$)
    ).subscribe(list => {
      this.availableList = list.filter(volunteer => volunteer.gender === this.currentgender);
      this.activeList = list.filter(volunteer => volunteer.gender === this.currentgender && (volunteer.load & this.daymask));
    });
    this.vs.unprocessed$().pipe(takeUntil(this._destroy$))
      .subscribe(unprocessed => this.unprocessed = unprocessed);
  }

  ngOnDestroy() {
    this._destroy$.next();
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
    this.onToggleVolunteer({ checked, id });
  }

  private checkDay(currentid: number): void {
    if (!this.days.length) {
      this.days = Array.from(this.adapter.daysMapper)
        .map(([day, mask]) => {
          const id = Math.log2(mask) + 1;
          const checked = id === currentid;
          day = day.split(' ')[0];
          return { day, id, checked };
        });
    } else {
      this.days = this.days.map(day => {
        const checked = currentid === day.id;
        return {...day, checked};
      })
    }
  }

  public process(): void {
    this.vs.processAllVolunteers();
  }

  public reset(): void {
    this.dialog.open(DialogComponent)
    .afterClosed()
    .subscribe(result => {
      if (result) {
        this.vs.reset();
      }
    })
  }
}
