import { IdService } from './services/id/id.service';
import { AppRoutingModule } from './app-routing.module';
import { LocationService } from './services/location/location.service';
import { PlaceMarkerService } from './services/marker/place-marker.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GameComponent } from './components/game/game.component';
import { CreateGameComponent } from './components/create-game/create-game.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    CreateGameComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    environment.production ? ServiceWorkerModule.register('ngsw-worker.js') : []
  ],
  exports : [],
  providers: [PlaceMarkerService, LocationService, IdService],
  bootstrap: [AppComponent]
})
export class AppModule { }
