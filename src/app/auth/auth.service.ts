import { Injectable } from '@angular/core';
import { Auth } from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _auth: Auth;

  constructor() {
    const json = localStorage.getItem('volunteers.auth');
    const auth = <Auth>JSON.parse(json);
    if (auth) {
      this._auth = auth;
    }
  }

  get token(): string {
    return this._auth.token;
  }

  public setToken(token: string, expires: number): void {
    const auth = {
      token,
      expires: expires * 1000 + Date.now()
    }
    this._auth = auth;
    const json = JSON.stringify(auth);
    localStorage.setItem('volunteers.auth', json);
  }

  public verify(): boolean {
    if (this._auth) {
      const expires = new Date(this._auth.expires).valueOf();
      const now = Date.now().valueOf();
      const timeLeft = expires - now;
      return timeLeft > 0;
    } else {
      return false;
    }
  }
}
