import { AfterViewInit, Component, inject, Injector, OnInit } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CommonApp } from 'src/app/core/services/common';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [NgClass, RouterLink],
  templateUrl: './projects-page.component.html',
  styleUrls: ['./projects-page.component.scss']
})
export class ProjectsPageComponent extends CommonApp implements OnInit {
  // private svc = inject(ProjectService);
  // // If you fetch from API here, replace with observable.
  projectList: any[] = [];
  private dialog = inject(Dialog);
  // Project[] = Array.from((this.svc as any)?._cache?.values?.() ?? []) as Project[];

  constructor(public override injector: Injector,) {
    super(injector);
  }

  ngOnInit() {
    this.loading.show();
    this.getProjectList();
  }

  getProjectList() {
    this.portfolioServices.listProjects().subscribe({
      next: res => {
        this.projectList = res;
        console.log('Project list:', res);
        this.loading.hide();
      },
      error: err => {
        console.error('Error fetching project list:', err);
        this.loading.hide();
      }
    });
  }

  techClass(tech: string): string {
    return tech.replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  }


}
