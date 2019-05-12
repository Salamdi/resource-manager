import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DayComponent } from './day/day.component';
import { VolunteersResolverService } from './volunteers-resolver.service';
import { Gender } from './models';
import { AuthComponent } from './auth/auth.component';
import { ConfComponent } from './conf/conf.component';
import { ConfResolverService } from './conf-resolver.service';
import { AuthResolverService } from './auth-resolver.service';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    pathMatch: 'full',
    canActivate: [AuthResolverService]
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
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
