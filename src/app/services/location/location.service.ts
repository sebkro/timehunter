import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Location, LocationFactory } from '../../data-model';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/map';

@Injectable()
export class LocationService {

  constructor(
    @Inject('LOCATION_SERVICE_URL') private apiUrl: string,
    private http: Http) { }

    findStartingPoint(latitude: number, longitude: number): Observable<Location> {
      const query = latitude + '/' + longitude;
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');

      const url = 'https://us-central1-cgihunt.cloudfunctions.net/app/timehunter/startingpoint/50.3/2';

      return this.http
      // .get(this.apiUrl + '/startingpoint/' + query, { headers: headers })
      .get(url, { headers: headers })
      .map(response => response.json())
      .map(rawLocation => LocationFactory.fromObject(rawLocation));
    }

}
