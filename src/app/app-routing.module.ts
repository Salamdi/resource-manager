import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DayComponent } from './day/day.component';
import { VolunteersResolverService } from './volunteers-resolver.service';
import { Gender } from './models';
import { AuthComponent } from './auth/auth.component';
import { ConfComponent } from './conf/conf.component';
import { ConfResolverService } from './conf-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    pathMatch: 'full'
  },
  {
    path: 'conf',
    component: ConfComponent,
    canActivate: [ConfResolverService]
  },
  {
    path: 'day/:gender/:mask',
    component: DayComponent,
    pathMatch: 'prefix',
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
