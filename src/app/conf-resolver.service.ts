import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ConfResolverService implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }

  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.auth.verify()) {
      return true
    }

    this.router.navigateByUrl('/');
    return false;
  }
}
