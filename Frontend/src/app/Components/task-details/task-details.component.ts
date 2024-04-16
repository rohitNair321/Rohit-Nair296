import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from 'src/app/Services/task.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent {

  taskID!: number;
    constructor(private router: Router, private taskservices: TaskService, private route: ActivatedRoute){
      this.route.queryParams.subscribe({
        next: result =>{
          this.taskID = +result['taskId']; // Access route parameter 'id'
        },
        error: (e) =>{

        }
      });
    }

    taskData: any;
    ngOnInit(){
      this.taskservices.getTaskList().subscribe({
        next: tasks => {
          this.taskData = tasks.find(x=>x.id === this.taskID);
        },
        error: (e) =>{

        }
      });
    }

    taskName: any;
    editTaskName() {
      throw new Error('Method not implemented.');
    }

    taskDetails: any;
    editTaskDetails() {
      throw new Error('Method not implemented.');
    }

    selectedStatus: any;
    editComments() {
      throw new Error('Method not implemented.');
    }

    editAttachments() {
    throw new Error('Method not implemented.');
    }

    taskDate: any;
    saveTask() {
      throw new Error('Method not implemented.');
    }

    cancel() {
      this.router.navigateByUrl('/task-list')
    }

}
