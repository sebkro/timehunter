import { Injectable } from '@angular/core';
import { } from '@types/googlemaps';

@Injectable()
export class PlaceMarkerService {

  constructor() { }

  setPositionMarker(googleMap: google.maps.Map, latitude: number, longitude: number): google.maps.Marker {
    return new google.maps.Marker({
      position: new google.maps.LatLng(latitude, longitude),
      map: googleMap,
      title: 'Hello World!'
    });
  }

}
