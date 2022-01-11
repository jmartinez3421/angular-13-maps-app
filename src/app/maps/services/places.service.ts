import { Injectable } from '@angular/core';
import { PlacesResponse, Feature } from '../interfaces/places.interface';
import { environment } from 'src/environments/environment';
import { PlacesApiClient } from '../api/placesApiClient';
import { MapsService } from './maps.service';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  public userLocation: [number, number] | undefined;
  public isLoadingPlaces: boolean = false;
  public places: Feature[] = [];
  
  get isUserLocationReady():boolean{
    return !!this.userLocation;
  }

  constructor(
    private http: PlacesApiClient, 
    private mapService: MapsService
  ) { 
    this.getUserLocation();
  }


  public async getUserLocation(): Promise<[number,number]>{
    return new Promise( (resolve, reject) => {

      navigator.geolocation.getCurrentPosition(
        ( {coords} ) => {
          this.userLocation = [coords.longitude, coords.latitude];
          resolve(this.userLocation);
        },
        ( err ) => {
          alert('No se pudo obtener la Geolocalización');
          console.log(err);
          reject();
        }
      )

    })
  }

  getPlacesByQuery(query: string = ''){
    if(query.length === 0){
      this.isLoadingPlaces = false;
      this.places = [];
      return;
    }


    this.isLoadingPlaces = true
    this.http.get<PlacesResponse>(`/${ query }.json`, {
      params: {
        proximity: this.userLocation!.join(',')
      }
    })
      .subscribe( resp => {
        this.isLoadingPlaces = false;
        this.places = resp.features;

        this.mapService.createMarkersFromPlaces(this.places, this.userLocation!);
      } );
  }

  deletePlaces(){
    this.places = [];
  }

}
