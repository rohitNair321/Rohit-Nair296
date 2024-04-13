import { Component } from '@angular/core';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent {

    constructor(){

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
      throw new Error('Method not implemented.');
    }

}
