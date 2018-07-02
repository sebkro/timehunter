import { LocationService } from './../../services/location/location.service';
import { CreateGameForm } from './create-game-form';
import { IdService } from './../../services/id/id.service';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { PlaceMarkerService } from '../../services/marker/place-marker.service';
import { Location } from '../../data-model';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html'
})
export class CreateGameComponent implements OnInit {

  constructor(private zone: NgZone,
    private placeMarkerService: PlaceMarkerService,
    private locationService: LocationService,
    private idService: IdService) { }

  @ViewChild('gmap') gmapElement: any;

  map: google.maps.Map;
  markers: google.maps.Marker[] = [];
  model: CreateGameForm;

  ngOnInit() {
    const mapProp = {
      center: new google.maps.LatLng(53.5422562, 9.9891803),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    google.maps.event.addListener(this.map, 'click',
       (e) => this.zone.run(() => this.mapClicked(e.latLng)));

    this.model = new CreateGameForm('');
  }

  public mapClicked(latLng: google.maps.LatLng) {
    const marker = this.placeMarkerService.setTargetPositionMarker(this.map, latLng.lat(), latLng.lng());
    marker.setDraggable(true);
    marker.setTitle(this.idService.createId(100));
    google.maps.event.addListener(marker, 'click',
      (e) => this.zone.run(() => this.removeMarker(marker)));
    this.markers[this.markers.length] = marker;

  }

  public removeMarker(marker: google.maps.Marker) {
    const index = this.markers.findIndex(elem => elem.getTitle() === marker.getTitle());
    this.markers[index].setMap(null);
    this.markers.splice(index, 1);
  }

  onSubmit() {
    const markers = this.markers
      .map(elem => new Location(elem.getPosition().lat(), elem.getPosition().lng(), false));
    this.locationService.createGame(this.model.name, markers);
  }

}
