import { CreateGameComponent } from './components/create-game/create-game.component';
import { GameComponent } from './components/game/game.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
export const routes: Routes = [
  {
    path: '', redirectTo: 'create', pathMatch: 'full'
  }, {
    path: 'play',
    component: GameComponent
  },
  {
    path: 'create',
    component: CreateGameComponent
  }

];
@NgModule({
  imports: [RouterModule.forRoot(routes)], exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
