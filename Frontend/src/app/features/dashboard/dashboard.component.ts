import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html', // Use external HTML file
  styleUrls: ['./dashboard.component.css']  // Use external CSS file
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log('Dashboard Component Initialized');
  }

}
