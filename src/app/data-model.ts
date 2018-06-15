export class Location {
  latitude: number;
  longitude: number;

  constructor(latitude: number, longitude: number) {
      this.latitude = latitude;
      this.longitude = longitude;
  }
}

export class LocationFactory {
  static empty(): Location {
      return new Location(0, 0);
  }

  static fromObject(rawLocation: any): Location {
      return new Location(
          rawLocation.lat,
          rawLocation.long
      );
  }
}
