export class Location {
  latitude: number;
  longitude: number;
  niete: boolean;

  constructor(latitude: number, longitude: number, niete: boolean) {
      this.latitude = latitude;
      this.longitude = longitude;
      this.niete = niete;

  }
}

export class LocationFactory {
  static empty(): Location {
      return new Location(0, 0, false);
  }

  static fromObject(rawLocation: any): Location {
      return new Location(
          rawLocation.lat,
          rawLocation.lon,
          rawLocation.niete
      );
  }
}
