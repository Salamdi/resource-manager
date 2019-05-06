import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import {MatChipsModule} from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';

import { AvailableListComponent } from './available-list/available-list.component';
import { AvailableItemComponent } from './available-item/available-item.component';
import { DayComponent } from './day/day.component';
import { ActiveListComponent } from './active-list/active-list.component';

@NgModule({
  declarations: [
    AppComponent,
    AvailableListComponent,
    AvailableItemComponent,
    DayComponent,
    ActiveListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatListModule,
    MatChipsModule,
    MatDividerModule,
    MatCheckboxModule,
    MatIconModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
