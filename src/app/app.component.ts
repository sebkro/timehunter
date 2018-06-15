import { Component, ViewChild, OnInit } from '@angular/core';
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
  private latitude;
  private longitude;

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;

  ngOnInit() {
    const mapProp = {
      center: new google.maps.LatLng(53.5422562, 9.9891803),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        success => {
          this.map.setCenter(new google.maps.LatLng(success.coords.latitude, success.coords.longitude));
          const marker = new google.maps.Marker({
            position: new google.maps.LatLng(success.coords.latitude, success.coords.longitude),
            map: this.map,
            title: 'Hello World!'
          });
        }, error => {
          alert('bla');
        });
    }

  }


  }

}
