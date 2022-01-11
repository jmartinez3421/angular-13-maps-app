import { Injectable } from '@angular/core';
import { AnySourceData, LngLat, LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { Feature } from '../interfaces/places.interface';
import { DirectionsApiClient } from '../api/directionsApiClient';
import { DirectionsResponse, Route } from '../interfaces/directions.interface';

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  private map: Map | undefined;
  private markers: Marker[] = [];

  get isMapReady(){
    return !!this.map;
  }

  constructor(private directionsApi: DirectionsApiClient){}

  setMap(map: Map){
    this.map = map;
  }

  flyTo(coords: LngLatLike){
    if(!this.isMapReady) throw Error('El mapa no esta inicializado');

    this.map?.flyTo({
      center: coords,
      zoom: 11
    });
  }

  createMarkersFromPlaces(places: Feature[], userLocation:[number, number] ){
    if(!this.map) throw Error('El mapa no existe');

    this.markers.forEach( marker => marker.remove() );
    const newMarkers = [];

    for (const place of places) {
      const [lng, lat] = place.center;
      const popup = new Popup()
        .setHTML(`
          <h6>${place.text_es}</h6>
          <span>${place.place_name_es}</span>
        `);

      const newMarker = new Marker()
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(this.map);

      newMarkers.push(newMarker);
    }

    this.markers = newMarkers;

    if( places.length === 0 ) return;

    const bounds = new LngLatBounds();
    newMarkers.forEach(marker => bounds.extend(marker.getLngLat()));
    bounds.extend(userLocation);
    this.map.fitBounds(bounds, {
      padding: 20
    })

  }


  getRouteBetweenPoints(start: [number,number], end:[number,number]){
    this.directionsApi.get<DirectionsResponse>(`/${start.join(',')};${end.join(',')}`)
      .subscribe(resp => {
        this.drawPolyline(resp.routes[0]);
      })
  }

  private drawPolyline(route: Route){

    console.log({kms: route.distance / 1000, duration: route.duration / 60});

    if( !this.map ) throw Error('Mapa no inicializado');

    const coords = route.geometry.coordinates;
    const start = coords[0] as [number,number];

    const bounds = new LngLatBounds();
    coords.forEach( ([lng, lat]) => {
      bounds.extend([lng, lat]) 
    })

    this.map?.fitBounds(bounds, {
      padding: 200
    })

    const sourceData: AnySourceData = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coords
            }
          }
        ]
      }
    }

    //TODO: Limpiar ruta previa
    if(this.map.getLayer('RouteString')){
      this.map.removeLayer('RouteString');
      this.map.removeSource('RouteString');
    }

    this.map.addSource('RouteString', sourceData);

    this.map.addLayer({
      id: 'RouteString',
      type: 'line',
      source: 'RouteString',
      layout: {
        "line-cap": 'round',
        "line-join":'round'
      },
      paint:{
        "line-color": 'black',
        "line-width": 3
      }
    })
  }
}
