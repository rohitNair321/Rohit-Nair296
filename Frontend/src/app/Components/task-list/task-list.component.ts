import { Component } from '@angular/core';
import { TaskService } from 'src/app/Services/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent {

  constructor(private taskservices: TaskService){

  }

  taskList: any[]=[];
  ngOnInit(){
    this.taskservices.getTaskList().subscribe(tasks =>{
      this.taskList = tasks;
    });
  }

  taskDetails: any;
  taskName: any;
  selectedTask: any[] = [];
  selectTask(taskID: any){
    this.taskList.map(task=>{
      if(task.id===taskID.id){
        this.taskName = task.title;
        this.taskDetails = task.description;
      }
    });
  }

  completeTask(tasks: any){

  }
  editTask(tasks: any){

  }
  startTask(tasks: any){

  }
  holdTask(tasks: any){

  }
  deleteTask(tasks: any){

  }

}
