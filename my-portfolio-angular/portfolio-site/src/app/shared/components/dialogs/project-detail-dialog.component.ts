import { Component, inject } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

export interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  technologies?: string[];
  liveDemo?: string;
  sourceCode?: string;
}

@Component({
  selector: 'app-project-detail-dialog',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './project-detail-dialog.component.html',
  styleUrls: ['./project-detail-dialog.component.css']
})
export class ProjectDetailDialogComponent {
  data = inject<Project>(DIALOG_DATA);
  private ref = inject(DialogRef<ProjectDetailDialogComponent>);
  close() { this.ref.close(); }
}
