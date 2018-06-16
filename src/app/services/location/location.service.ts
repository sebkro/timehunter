import { Observable } from 'rxjs/Observable';
import { Injectable, Inject } from '@angular/core';
import { Location, LocationFactory } from '../../data-model';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

@Injectable()
export class LocationService {

  private jsonHeaders;
  private possibleIdChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  constructor(
    @Inject('LOCATION_SERVICE_URL') private apiUrl: string,
    private http: Http) {
      this.jsonHeaders = new Headers();
      this.jsonHeaders.append('Content-Type', 'application/json');
    }

    findStartingPoint(latitude: number, longitude: number): Observable<Location> {
      const query = latitude + '/' + longitude + '/' + this.getUserId();

      return this.http
      .get(this.apiUrl + '/startingpoint2/' + query, { headers: this.jsonHeaders })
      .map(response => response.json())
      .map(rawLocation => LocationFactory.fromObject(rawLocation));
    }

    getNextPoints(latitude: number, longitude: number): Observable<Array<Location>> {
      const query = latitude + '/' + longitude + '/' + this.getUserId();

      return this.http
      .get(this.apiUrl + '/nextpoints/' + query, { headers: this.jsonHeaders })
      .map(response => response.json())
      .map(rawLocations => rawLocations
        .map(rawLocation => LocationFactory.fromObject(rawLocation))
      );
    }

    private getUserId() {
      let userId = window.localStorage.getItem('userId');
      if (!userId) {
        userId = '';
        for (let i = 0; i < 30; i++) {
          userId += this.possibleIdChars.charAt(Math.floor(Math.random() * this.possibleIdChars.length));
        }
        window.localStorage.setItem('userId', userId);
      }
      return userId;
    }

    public calcDistance(lat1, lon1, lat2, lon2) {
      const earthRadius = 6371;
      const dLat = this.toRad(lat2 - lat1);
      const dLon = this.toRad((lon2 - lon1));
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = earthRadius * c;
      return d;
    }

    private toRad(n: number) {
      return n * Math.PI / 180;
    }

}
