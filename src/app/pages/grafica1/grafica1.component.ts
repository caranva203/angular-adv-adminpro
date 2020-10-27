import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component implements OnInit {

   public Labels1: string[] = ['Pan', 'Refresco', 'Tacos'];
   public data1 = [
    [10, 15, 40],
   ];

  constructor() { }

  ngOnInit(): void {
  }

}
