import { GameComponent } from './components/game/game.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';

import { Location } from './data-model';
import { LocationService } from './services/location/location.service';
import { PlaceMarkerService } from './services/marker/place-marker.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [],
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
  menuSlider = false;
  gameActive = false;

  @ViewChild(GameComponent)
  gameComponent: GameComponent;

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.gameActive = event.url === '/play';
      }
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

  public restartGame() {
    this.gameComponent.restartGame();
    this.menuSlider = false;
  }
}
