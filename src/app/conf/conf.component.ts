import { Component, OnInit, OnDestroy } from '@angular/core';
import { Conf } from '../models/conf';
import { VolunteerService } from '../volunteer.service';
import { Volunteer } from '../models';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil, mergeMap, map, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { AuthService } from '../auth/auth.service';

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
  showList: boolean;
  private _destroy$ = new Subject<void>();
  public prevPage: { day: string, gender: string } | null;
  private _search$ = new BehaviorSubject('');

  constructor(
    private vs: VolunteerService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this._search$.asObservable().pipe(
      map(query => query.toLowerCase()),
      mergeMap(query => this.vs.volunteersList$(127).pipe(
        tap(list => this.showList = list.length > 0),
        map(list => list
          .filter(volunteer =>
            volunteer.name.toLowerCase().includes(query)|| volunteer.surname.toLowerCase().includes(query)))
      )),
      takeUntil(this._destroy$)
    ).subscribe(list => this.list = list);
    this.route.queryParamMap
      .subscribe(params => {
        const day = params.get('day');
        const gender = params.get('gender');
        if (day && gender) {
          this.prevPage = { day, gender }
        } else {
          this.prevPage = null;
        }
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
  }

  public handleSubmit(): void {
    let { id, range, sheet } = this.model;
    id = id.trim();
    range = range.trim();
    sheet = sheet.trim();
    this.vs.fetchNewList(id, range, sheet);
  }

  public handleSave(): void {
    this.vs.persist();
    const url = this.prevPage ? `day/${this.prevPage.gender}/${this.prevPage.day}` : 'day/1/1';
    this.router.navigateByUrl(url);
  }

  public handleRemove(id: number): void {
    this.dialog.open(DialogComponent)
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.vs.removeVolunteer(id);
        }
      });
  }

  public handleSearch(query: string): void {
    this._search$.next(query);
  }

  public goBack(): void {
    const url = this.prevPage ? `day/${this.prevPage.gender}/${this.prevPage.day}` : 'day/1/1';
    this.router.navigateByUrl(url);
  }

  public refreshList(): void {
    this.dialog.open(DialogComponent)
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.vs.drop();
          if (!this.auth.verify()) {
            this.router.navigateByUrl('/auth');
          }
        }
      })
  }
}
