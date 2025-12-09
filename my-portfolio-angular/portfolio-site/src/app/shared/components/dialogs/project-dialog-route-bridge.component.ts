import { Component, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Dialog } from '@angular/cdk/dialog';
import { ProjectDetailDialogComponent, Project } from './project-detail-dialog.component';
import { Subscription } from 'rxjs';
import { SupabaseService } from 'src/app/core/services/supabase.service';

@Component({
  selector: 'app-project-dialog-route-bridge',
  standalone: true,
  template: `` // no UI here
})
export class ProjectDialogRouteBridgeComponent implements OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(Dialog);
  private projectSvc = inject(SupabaseService, { optional: true });

  private sub = new Subscription();

  constructor() {
    const id = this.route.snapshot.paramMap.get('id')!;
    // Prefer project passed via navigation state (fast path from list)
    let project: Project | undefined = history.state?.project;

    const open = (p: Project | undefined) => {
      const ref = this.dialog.open(ProjectDetailDialogComponent, {
        data: p,
        backdropClass: ['cdk-overlay-dark-backdrop'],
        panelClass: ['p-3'] // bootstrap spacing
      });

      // When dialog closes, clear the modal outlet
      this.sub.add(
        ref.closed.subscribe(() => {
          this.router.navigate([{ outlets: { modal: null } }], {
            queryParamsHandling: 'preserve'
          });
        })
      );
    };

    if (project) {
      open(project);
    } else if (this.projectSvc) {
      // Fallback: fetch from a shared service if user opened a deep link
    //   const found = this.projectSvc.getById(id);
    //   open(found);
    } else {
      open(undefined); // dialog will still open; show an error/placeholder inside if needed
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
