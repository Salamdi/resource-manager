import { Component, OnInit, OnDestroy } from '@angular/core';
import { Conf } from '../models/conf';
import { VolunteerService } from '../volunteer.service';
import { Volunteer } from '../models';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-conf',
  templateUrl: './conf.component.html',
  styleUrls: ['./conf.component.scss']
})
export class ConfComponent implements OnInit, OnDestroy {
  model: Conf = {
    id: '',
    sheet: '',
    range: '',
  };
  list: Array<Volunteer>;
  private destroy$ = new Subject<void>();

  constructor(
    private vs: VolunteerService,
    private router: Router
  ) { }

  ngOnInit() {
    this.vs.volunteersList(127).pipe(
      takeUntil(this.destroy$.asObservable())
    ).subscribe(list => this.list = list)
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  public handleSubmit(): void {
    let {id, range, sheet} = this.model;
    id = id.trim();
    range = range.trim();
    sheet = sheet.trim();
    this.vs.fetchNewList(id, range, sheet);
  }

  public handleSave(): void {
    this.vs.persist();
    this.router.navigateByUrl('day/1/1');
  }
}
