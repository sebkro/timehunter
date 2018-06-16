import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';

import { Location } from './data-model';
import { LocationService } from './services/location/location.service';
import { PlaceMarkerService } from './services/marker/place-marker.service';

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
  menuSlider = false;

  private positionMarker: google.maps.Marker;
  private targetMarker: google.maps.Marker;
  private target: Location;



  readonly STARTING_POINT_KEY = 'startingPoint';
  readonly BLANKS_KEY = 'blanks';
  readonly TARGET_KEY = 'target';
  readonly STATE_KEY = 'state';


  @ViewChild('gmap') gmapElement: any;


  constructor(private markerService: PlaceMarkerService,
    private locationService: LocationService) { }

  ngOnInit() {
    const mapProp = {
      center: new google.maps.LatLng(53.5422562, 9.9891803),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

    if (navigator.geolocation) {
      this.updateUserPosition();
      if (GameState.PRESTART === localStorage.getItem(this.STATE_KEY)) {
        this.target = JSON.parse(localStorage.getItem(this.STARTING_POINT_KEY));
        this.targetMarker = this.markerService.setTargetPositionMarker(this.map, this.target.latitude, this.target.longitude);
      } else if (GameState.RUNNING === localStorage.getItem(this.STATE_KEY)) {
        console.log('GameState Running');

      } else {
        this.initGame();
      }
    }
  }

  private initGame() {
    navigator.geolocation.getCurrentPosition(
      success => {
        this.locationService.findStartingPoint(success.coords.latitude, success.coords.longitude).subscribe(result => {
          localStorage.setItem(this.STARTING_POINT_KEY, JSON.stringify(result));
          localStorage.setItem(this.STATE_KEY, GameState.PRESTART);
          this.target = result;
          this.targetMarker = this.markerService.setTargetPositionMarker(this.map, result.latitude, result.longitude);
        });
    });
  }

  private updateUserPosition() {
    navigator.geolocation.getCurrentPosition(
      success => {
        if (this.positionMarker) {
          this.positionMarker.setPosition(new google.maps.LatLng(success.coords.latitude, success.coords.longitude));
          this.map.setCenter(new google.maps.LatLng(success.coords.latitude, success.coords.longitude));
        } else {
          this.map.setCenter(new google.maps.LatLng(success.coords.latitude, success.coords.longitude));
          this.positionMarker = this.markerService.setOwnPositionMarker(this.map, success.coords.latitude, success.coords.longitude);
        }
        if (this.target) {
          console.log('new Position: ' + success.coords.latitude + ' ' + success.coords.longitude);
        }
        setTimeout(() => this.updateUserPosition(), 15000);
      }, error => {
        alert('Fehler bei der Positionsermittlung');
      });
  }

  public navClicked() {
        console.log('NavClicked');
        if (this.menuSlider === true) {
          this.menuSlider = false;
        } else {
          this.menuSlider = true;
        }
  }

}


enum GameState {
  NOT_INITIALIZED = 'NOT_INITIALIZED',
  PRESTART = 'PRESTART',
  RUNNING = 'RUNNING'
}
