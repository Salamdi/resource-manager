import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Volunteer } from '../models/volunteer.model';
import { VolunteerService } from '../volunteer.service';
import { Subscription } from 'rxjs';
import { ToggleEvent } from '../available-item/available-item.component';

@Component({
  selector: 'app-available-list',
  templateUrl: './available-list.component.html',
  styleUrls: ['./available-list.component.scss']
})
export class AvailableListComponent {
  @Input() volunteers: Array<Volunteer>;
  @Input() daymask: number;
  @Output() toggleVolunteer = new EventEmitter<ToggleEvent>();

  constructor() { }

  public onToggleItem(event: ToggleEvent): void {
    this.toggleVolunteer.emit(event);
  }
}
