import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Volunteer } from '../models';

@Component({
  selector: 'app-active-list',
  templateUrl: './active-list.component.html',
  styleUrls: ['./active-list.component.scss']
})
export class ActiveListComponent implements OnInit {
  @Input() volunteers: Array<Volunteer>;
  @Output() removeItem = new EventEmitter<number>();

  constructor(
  ) { }

  ngOnInit() {
  }

  public onRemove(id: number): void {
    this.removeItem.emit(id);
  }

}
