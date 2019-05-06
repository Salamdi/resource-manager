import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Volunteer } from '../models';
import { VolunteerAdapterService } from '../volunteer-adapter.service';
import { VolunteerService } from '../volunteer.service';

export interface ToggleEvent { checked: boolean; id: number };

@Component({
  selector: 'app-available-item',
  templateUrl: './available-item.component.html',
  styleUrls: ['./available-item.component.scss']
})
export class AvailableItemComponent implements OnInit, OnChanges {
  @Input() volunteer: Volunteer;
  @Input() daymask: number;
  @Output() toggleItem = new EventEmitter<ToggleEvent>()
  public checked: boolean;
  public tags: Array<{ disabled: boolean, day: string }> = [];

  constructor(
    private adapter: VolunteerAdapterService,
    private vs: VolunteerService
  ) { }

  ngOnInit() {
    this.tags = Array.from(this.adapter.daysMapper)
      .reduce((tags, [fullday, mask]) => {
        const {availability, load} = this.volunteer;
        const available = availability & mask;
        if (available) {
          const disabled = load & mask;
          const day = fullday.split(' ')[0];
          return [...tags, {day, disabled}];
        }
        return tags;
      }, []);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.daymask) {
      this.checked = !!(this.volunteer.load & this.daymask);
    }
  }

  public onChange({checked}: {checked: boolean}): void {
    const {id} = this.volunteer;
    this.toggleItem.emit({checked, id});
  }

}
