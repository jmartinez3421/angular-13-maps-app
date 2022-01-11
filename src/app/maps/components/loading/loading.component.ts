import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styles: [`
    .loading-map{
      background-color: rgba(0,0,0, 0.8);
      color: white;
      height: 100vh;
      position: fixed;
      right: 0px;
      top: 0px;
      width: 100vw;
    }
  `]
})
export class LoadingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
