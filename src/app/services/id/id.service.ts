import { Injectable } from '@angular/core';

@Injectable()
export class IdService {

  private possibleIdChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  constructor() { }

  public createId(numberofChars: number) {
    let id = '';
    for (let i = 0; i < numberofChars; i++) {
      id += this.possibleIdChars.charAt(Math.floor(Math.random() * this.possibleIdChars.length));
    }
    return id;
  }

}
