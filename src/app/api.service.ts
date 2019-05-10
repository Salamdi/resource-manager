import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, EMPTY } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { }

  public getData(spreadheetId: string, range: string, sheet?: string): Observable<Array<Array<string>>> {
    if (!this.auth.verify()) {
      return of([]);
    }
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.auth.token}`
      })
    };
    if (spreadheetId && range) {
      const endpoint = sheet
        ? `https://sheets.googleapis.com/v4/spreadsheets/${spreadheetId}/values/${sheet}!${range}`
        : `https://sheets.googleapis.com/v4/spreadsheets/${spreadheetId}/values/${range}`;
      return this.http.get<{values: Array<Array<string>>}>(endpoint, options).pipe(
        map(({values}) => values),
        catchError(error => {
          console.error(error);
          return of([])
        })
      );
    }
    return of([]);
  }
}
