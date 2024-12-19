import { Component } from '@angular/core';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent {
  projects = [
    {
      title: 'Project 1',
      description: 'Description of project 1',
      image: 'assets/project1.jpg',
      link: 'https://example.com/project1'
    },
    {
      title: 'Project 2',
      description: 'Description of project 2',
      image: 'assets/project2.jpg',
      link: 'https://example.com/project2'
    },
    {
      title: 'Project 3',
      description: 'Description of project 3',
      image: 'assets/project3.jpg',
      link: 'https://example.com/project3'
    }
  ];
}
