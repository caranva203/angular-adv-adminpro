import { Component, Input, OnInit } from '@angular/core';
import { Color, Label, MultiDataSet } from 'ng2-charts';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent implements OnInit {
  
  @Input() title: string = 'Sin título';
  @Input() labels: string[] = [];
  @Input() data: number[][] = [];

  // Doughnut
  @Input('labels') doughnutChartLabels: Label[] = ['Label1', 'Label2', 'Label3'];

  @Input('data') public doughnutChartData: MultiDataSet = [
    [50, 50, 50],
  ];

  public colors: Color[] = [
    { backgroundColor: [ '#6857E6', '#009FEE', '#F02059' ] }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
