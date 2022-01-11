import { Component } from '@angular/core';
import { MapsService, PlacesService } from '../../services';

@Component({
  selector: 'app-btn-my-location',
  templateUrl: './btn-my-location.component.html',
  styles: [`
    button{
      position: fixed;
      top: 20px;
      right: 20px;
    }
  `]
})
export class BtnMyLocationComponent {

  constructor(private mapsService: MapsService, private placesService: PlacesService) { }

  goToMyLocation(){
    if(!this.placesService.isUserLocationReady) throw Error('No hay ubicacion de usuario');
    if(!this.mapsService.isMapReady) throw Error('No hay mapa disponible');

    this.mapsService.flyTo(this.placesService.userLocation!);
  }

}
