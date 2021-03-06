 import { Injectable } from '@angular/core';
import * as L from 'leaflet';
 import { environment } from '../../environments/environment';

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
  createMarker(lat: number, lng: number, marker: string, userInfo: {name: string, content: string, title: string}): void {
    const myIcon = L.icon({
      iconUrl: marker,
      iconSize: [40, 40],
      className: 'icon'
    });
    let popup = L.popup({closeButton: false})
      .setContent(`<div class="popup">
                   <span class="popup-title">${userInfo.name} - ${userInfo.title}</span>
                   <div class="popup-content">
                   <img class="popup-img" src="${environment.apiUrl + '/uploads/' + userInfo.content}" alt="">
                   </div>
                   </div>`);
    L.marker([lat, lng], {icon: myIcon})
      .addTo(this.map)
      .bindPopup(popup)
  }

}
