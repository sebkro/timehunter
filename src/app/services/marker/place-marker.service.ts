import { Injectable } from '@angular/core';
import { } from '@types/googlemaps';

@Injectable()
export class PlaceMarkerService {

  constructor() { }

  setOwnPositionMarker(googleMap: google.maps.Map, latitude: number, longitude: number): google.maps.Marker {
    return new google.maps.Marker({
      position: new google.maps.LatLng(latitude, longitude),
      map: googleMap,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8
      },
      title: 'This is you!'
    });
  }

  setTargetPositionMarker(googleMap: google.maps.Map, latitude: number, longitude: number): google.maps.Marker {
    return new google.maps.Marker({
      position: new google.maps.LatLng(latitude, longitude),
      map: googleMap,
      icon: 'assets/icons/marker_unbekannt.png',
      title: 'Target!'
    });
  }

  markMarkerAsBlank(marker: google.maps.Marker): google.maps.Marker {
    marker.setIcon('assets/icons/marker_falsch.png');
    return marker;
  }

  markMarkerAsTarget(marker: google.maps.Marker): google.maps.Marker {
    marker.setIcon('assets/icons/marker_richtig.png');
    return marker;
  }

}
