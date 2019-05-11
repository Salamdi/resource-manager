import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { VolunteerService } from './volunteer.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfResolverService implements CanActivate {

  constructor(private auth: AuthService, private router: Router, private vs: VolunteerService) { }

  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.vs.volunteersList(127).pipe(
      map(list => {
        const can = this.auth.verify() || list.length > 0;
        if (!can) this.router.navigateByUrl('/');
        return can;
      })
    );
  }
}
