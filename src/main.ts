import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic([
  {
    provide: 'LOCATION_SERVICE_URL',
    useValue: environment.locationServiceUrl
  }
]

).bootstrapModule(AppModule)
  .catch(err => console.log(err));
