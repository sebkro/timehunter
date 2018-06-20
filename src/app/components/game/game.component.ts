import { Location } from './../../data-model';
import { PlaceMarkerService } from './../../services/marker/place-marker.service';
import { LocationService } from './../../services/location/location.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html'
})
export class GameComponent implements OnInit {

  @ViewChild('gmap') gmapElement: any;

  debug = true;
  map: google.maps.Map;

  private positionMarker: google.maps.Marker;
  private target: Location;
  private targetMarker: google.maps.Marker;
  private blanks: Location[] = [];
  private blanksMarker: google.maps.Marker[] = [];
  private lastTargetMarkers: google.maps.Marker[] = [];
  private lastTargets: Location[] = [];

  readonly STARTING_POINT_KEY = 'game_startingPoint';
  readonly BLANKS_KEY = 'game_blanks';
  readonly TARGET_KEY = 'game_target';
  readonly LAST_TARGETS_KEY = 'game_lastTargets';
  readonly STATE_KEY = 'game_state';
  readonly MAX_DISTANCE_IN_KM = 0.05;

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
        const marker = this.markerService.setTargetPositionMarker(this.map, this.target.latitude, this.target.longitude);
        this.targetMarker = marker;
      } else if (GameState.RUNNING === localStorage.getItem(this.STATE_KEY)) {
        this.blanks = JSON.parse(localStorage.getItem(this.BLANKS_KEY));
        this.target = JSON.parse(localStorage.getItem(this.TARGET_KEY));
        this.addMarkerForTargetAndBlanks();
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
          this.blanks = [];
          this.lastTargets = [];
          this.addMarkerForTargetAndBlanks();
        });
      });
  }

  private updateUserPosition() {
    navigator.geolocation.getCurrentPosition(
      success => {
        if (this.positionMarker) {
          this.positionMarker.setPosition(new google.maps.LatLng(success.coords.latitude, success.coords.longitude));
        } else {
          this.positionMarker = this.markerService.setOwnPositionMarker(this.map, success.coords.latitude, success.coords.longitude);
        }
        this.map.setCenter(new google.maps.LatLng(success.coords.latitude, success.coords.longitude));

        this.checkIfTargetReached(success.coords);
        this.checkIfBlankReached(success.coords);
        setTimeout(() => this.updateUserPosition(), 5000);
      }, error => {
        alert('Fehler bei der Positionsermittlung');
      });
  }

  private checkIfTargetReached(position: Coordinates) {
    if (this.target) {
      const distance = this.locationService.calcDistance(this.target.latitude, this.target.longitude,
        position.latitude, position.longitude);
      if (distance < this.MAX_DISTANCE_IN_KM) {
        this.handleTargetReached();
      }
    }
  }

  private checkIfBlankReached(position: Coordinates) {
    if (this.blanks) {
      const newBlanks = [];
      for (let i = 0; i < this.blanks.length; i++) {
        const distance = this.locationService.calcDistance(this.blanks[i].latitude, this.blanks[i].longitude,
          position.latitude, position.longitude);
        if (distance >= this.MAX_DISTANCE_IN_KM) {
          newBlanks[newBlanks.length] = this.blanks[i];
        }
      }
      this.blanks = newBlanks;
      this.addMarkerForTargetAndBlanks();
    }
  }


  targetMarkerClicked() {
    this.handleTargetReached();
  }

  blankMarkerClicked() {
    if (this.blanks && this.blanks.length > 0) {
      this.blanks.splice(0, 1);
      this.addMarkerForTargetAndBlanks();
    }
  }

  public handleTargetReached() {
    this.locationService.getNextPoints(this.target.latitude, this.target.longitude).subscribe(newLocations => {
      localStorage.setItem(this.STATE_KEY, GameState.RUNNING);
      localStorage.removeItem(this.STARTING_POINT_KEY);
      this.lastTargets[this.lastTargets.length] = this.target;
      this.blanks = newLocations.filter(location => location.niete);
      this.target = newLocations.find(location => !location.niete);
      localStorage.setItem(this.BLANKS_KEY, JSON.stringify(this.blanks));
      localStorage.setItem(this.TARGET_KEY, JSON.stringify(this.target));
      localStorage.setItem(this.LAST_TARGETS_KEY, JSON.stringify(this.lastTargets));
      this.addMarkerForTargetAndBlanks();
    });
  }

  public restartGame() {
    if (this.targetMarker) {
      this.targetMarker.setMap(null);
    }
    if (this.blanksMarker) {
      this.blanksMarker.forEach(elem => elem.setMap(null));
    }
    if (this.lastTargetMarkers) {
      this.lastTargetMarkers.forEach(elem => elem.setMap(null));
    }
    localStorage.clear();
    this.initGame();
  }

  private addMarkerForTargetAndBlanks() {
    if (this.blanksMarker) {
      this.blanksMarker.forEach(elem => {
        elem.setMap(null);
      });
      this.blanksMarker = [];
    }
    if (this.lastTargetMarkers) {
      this.lastTargetMarkers.forEach(elem => {
        elem.setMap(null);
      });
      this.lastTargetMarkers = [];
    }
    if (this.targetMarker) {
      this.targetMarker.setMap(null);
    }
    if (this.blanks) {
      this.blanks.forEach(blank => {
        const blankMarker = this.markerService.setTargetPositionMarker(this.map, blank.latitude, blank.longitude);
        this.blanksMarker[this.blanksMarker.length] = blankMarker;
      });
    }
    if (this.target) {
      this.targetMarker = this.markerService.setTargetPositionMarker(this.map, this.target.latitude, this.target.longitude);
    }
    if (this.lastTargets) {
      this.lastTargets.forEach(elem => {
        const marker = this.markerService.setTargetPositionMarker(this.map, elem.latitude, elem.longitude);
        this.lastTargetMarkers[this.lastTargetMarkers.length] = marker;
        this.markerService.markMarkerAsTarget(marker);
      });
    }
  }

}



enum GameState {
  NOT_INITIALIZED = 'NOT_INITIALIZED',
  PRESTART = 'PRESTART',
  RUNNING = 'RUNNING'
}
