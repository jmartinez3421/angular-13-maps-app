import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MapsService, PlacesService } from '../../services';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styles: [`
    .map-container{
      width: 100vw;
      height: 100vh;
    }
  `]
})
export class MapViewComponent implements AfterViewInit {

  @ViewChild('mapDiv') map!: ElementRef;

  constructor( private placesService: PlacesService, private mapService: MapsService ) { }

  ngAfterViewInit(): void {
    if(!this.placesService.userLocation) throw Error('No hay user Location');
    
    var map = new mapboxgl.Map({
      container: this.map.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.placesService.userLocation,
      zoom: 13
    });

    const popup = new mapboxgl.Popup()
      .setHTML(`<h6>Aquí estoy</h6> <span>En este lugar del mundo</span>`);

    new mapboxgl.Marker({color: 'red'})
      .setLngLat(this.placesService.userLocation)
      .setPopup(popup)
      .addTo(map);

    this.mapService.setMap(map);
  }

}
