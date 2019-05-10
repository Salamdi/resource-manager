import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { authParams } from 'src/environments/environment';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  public unauthorized = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.route.fragment.subscribe(fragment => {
      const params = new URLSearchParams(fragment);
      const token = params.get('access_token');
      const expires = parseInt(params.get('expires_in'), 10);
      if (token) {
        this.auth.setToken(token, expires);
        this.unauthorized = false;
        this.router.navigateByUrl('/conf');
      } else {
        this.unauthorized = true;
      }
    });
  }

  public handleClick(): void {
    const endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
    const params = new URLSearchParams(authParams);
    const url = `${endpoint}?${params}`;
    location.href = url;
  }
}
