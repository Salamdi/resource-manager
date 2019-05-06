import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DayComponent } from './day/day.component';
import { VolunteersResolverService } from './volunteers-resolver.service';

const routes: Routes = [
  {
    path: 'day/:mask',
    component: DayComponent,
    pathMatch: 'full',
    resolve: {
      volunteers: VolunteersResolverService
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
