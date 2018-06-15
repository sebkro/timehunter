import { LocationService } from './services/location/location.service';
import { PlaceMarkerService } from './services/marker/place-marker.service';
import { Component, ViewChild, OnInit, Inject } from '@angular/core';
import { } from '@types/googlemaps';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('flyInOut', [
      state('in', style({transform: 'translateY(0)'})),
      transition(':enter', [
        style({transform: 'translateY(100%)'}),
        animate(500)
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  title = 'Raw';
  map: google.maps.Map;

  positionMarker: google.maps.Marker;

  target: google.maps.LatLng;


  @ViewChild('gmap') gmapElement: any;


  constructor(private markerService: PlaceMarkerService,
    private locationService: LocationService) { }

  ngOnInit() {
    const mapProp = {
      center: new google.maps.LatLng(53.5422562, 9.9891803),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.locationService.findStartingPoint(53.5422562, 9.9891803).subscribe(res => {
      alert(JSON.stringify(res));
      this.locationService.getNextPoints(53.5422562, 9.9891803).subscribe(elem => alert(JSON.stringify(elem)));
    });
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    if (navigator.geolocation) {
      this.updatePosition();
    }
  }

  private updatePosition() {
    navigator.geolocation.getCurrentPosition(
      success => {
        if (this.positionMarker) {
          this.positionMarker.setPosition(new google.maps.LatLng(success.coords.latitude, success.coords.longitude));
          this.map.setCenter(new google.maps.LatLng(success.coords.latitude, success.coords.longitude));
        } else {
          this.map.setCenter(new google.maps.LatLng(success.coords.latitude, success.coords.longitude));
          this.positionMarker = this.markerService.setOwnPositionMarker(this.map, success.coords.latitude, success.coords.longitude);
        }
        console.log('new Position: ' + success.coords.latitude + ' ' + success.coords.longitude);
        setTimeout(() => this.updatePosition(), 5000);
      }, error => {
        alert('bla');
      });

  }

}
