import { Component, OnInit } from '@angular/core';
import { Feature } from '../../interfaces/places.interface';
import { MapsService, PlacesService } from '../../services';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styles: [`
    .pointer{
      cursor: pointer;
    }

    p{
      font-size: 12px;
    }
  `]
})
export class SearchResultsComponent implements OnInit {

  selectedId: string = '';

  constructor( private placesService: PlacesService, private mapService: MapsService ) { }

  ngOnInit(): void {
  }

  get isLoadingPlaces(){
    return this.placesService.isLoadingPlaces;
  }

  get places(){
    return this.placesService.places;
  }

  classBtn(placeId: string){
    return (placeId === this.selectedId)? 'btn-light' : 'btn-primary';
  }

  flyTo( place: Feature ){
    this.selectedId = place.id;

    const [ lng, lat ] = place.center;

    this.mapService.flyTo([lng, lat]);
  }

  getDirections(place: Feature){
    this.placesService.deletePlaces();

    const start: [number,number] = this.placesService.userLocation!;
    const end: [number,number] = place.center as [number,number];

    this.mapService.getRouteBetweenPoints(start, end);
  }
}
