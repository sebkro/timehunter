import { Observable } from 'rxjs/Observable';
import { Injectable, Inject } from '@angular/core';
import { Location, LocationFactory } from '../../data-model';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

@Injectable()
export class LocationService {

  constructor(
    @Inject('LOCATION_SERVICE_URL') private apiUrl: string,
    private http: Http) { }

    findStartingPoint(latitude: number, longitude: number): Observable<Location> {
      const query = latitude + '/' + longitude + '/' + this.getUserId();
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');

      return this.http
      .get(this.apiUrl + '/startingpoint2/' + query, { headers: headers })
      // .get(url, { headers: headers })
      .map(response => response.json())
      .map(rawLocation => LocationFactory.fromObject(rawLocation));
    }

    getNextPoints(latitude: number, longitude: number): Observable<Array<Location>> {
      const query = latitude + '/' + longitude + '/' + this.getUserId();
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');

      const url = 'https://us-central1-cgihunt.cloudfunctions.net/app/timehunter/nextpoints/50.3/2';

      return this.http
      .get(this.apiUrl + '/nextpoints/' + query, { headers: headers })
      // .get(url, { headers: headers })
      .map(response => response.json())
      .map(rawLocations => rawLocations
        .map(rawLocation => LocationFactory.fromObject(rawLocation))
      );
    }

    private getUserId() {
      let userId = window.localStorage.getItem('userId');
      if (!userId) {
        userId = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 30; i++) {
          userId += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        window.localStorage.setItem('userId', userId);
      }
      return userId;
    }

}
