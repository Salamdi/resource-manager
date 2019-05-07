import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DayComponent } from './day/day.component';
import { VolunteersResolverService } from './volunteers-resolver.service';
import { Gender } from './models';

const routes: Routes = [
  {
    path: 'day/:gender/:mask',
    component: DayComponent,
    pathMatch: 'prefix',
    resolve: {
      volunteers: VolunteersResolverService
    }
  },
  {
    path: '',
    redirectTo: '/day/1/1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
