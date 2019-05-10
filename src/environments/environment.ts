// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false
};

export const authParams = {
  client_id: '569155344129-1p1ek0gd7put5c76aal2blrnoa8ak2pi.apps.googleusercontent.com',
  redirect_uri: 'http://localhost:8080',
  response_type: 'token',
  scope: 'https://www.googleapis.com/auth/spreadsheets.readonly'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
