import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  public map: any;
  public lat: any;
  public lng: any;

  constructor() {
  }

  initMap(): void {
    this.map = L.map('map').setView([42.874961, 74.601443], 15);
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 13,
      minZoom: 10,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });
    tiles.addTo(this.map);
  }

  createMarker(lat: number, lng: number, marker: string): void {
    const myIcon = L.icon({
      iconUrl: marker,
      iconSize: [40, 40],
    })
    L.marker([lat, lng], {icon: myIcon}).addTo(this.map).bindPopup('<p>Hello world!<br />This is a nice popup.</p>');
  }
}
