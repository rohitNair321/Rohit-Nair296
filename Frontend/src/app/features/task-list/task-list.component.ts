import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService, Task } from 'src/app/core/services/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  taskList: Task[] = []; // Updated to use the Task type
  loginUserName: string | null = null;
  newTaskForm: boolean = false;

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    // Fetch the logged-in user's name from session storage
    this.loginUserName = sessionStorage.getItem('loginUserName');

    // Fetch the task list from the service
    this.taskService.getTaskList(5).subscribe({
      next: (tasks) => {
        this.taskList = tasks; // Assign the fetched tasks to the taskList
        console.log('Task list fetched successfully:', this.taskList);
      },
      error: (error) => {
        console.error('Error fetching task list:', error);
      }
    });
  }

  onDrop(event: CdkDragDrop<Task[]>): void {
    // Handle drag-and-drop reordering of tasks
    moveItemInArray(this.taskList, event.previousIndex, event.currentIndex);
  }

  addNewTask(): void {
    this.newTaskForm = true;
  }

  editTaskName(taskId: number, taskTitle?: string): void {
    this.taskList = this.taskList.map((task) => {
      if (task.id === taskId) {
        // if (!isEdit) {
        //   task.titleEdit = true;
        // } else {
        //   task.title = taskTitle || task.title;
        //   task.titleEdit = false;
        // }
      }
      return task;
    });
  }

  changeTaskStatus(taskID: number, status: boolean, key?: string): void {
    this.taskList = this.taskList.map((task) => {
      if (task.id === taskID && status) {
        if (key) {
          (task as any)[key] = true; // Dynamically update the key if provided
        }
      }
      return task;
    });
  }

  completeTask(task: Task): void {
    console.log('Completing task:', task);
    // Add logic to mark the task as completed
  }

  editTask(taskID: number): void {
    this.router.navigate(['landing/task-details'], {
      queryParams: {
        taskId: taskID
      }
    });
  }

  startTask(task: Task): void {
    console.log('Starting task:', task);
    // Add logic to start the task
  }

  holdTask(task: Task): void {
    console.log('Holding task:', task);
    // Add logic to hold the task
  }

  deleteTask(task: Task): void {
    console.log('Deleting task:', task);
    // Add logic to delete the task
    this.taskList = this.taskList.filter((t) => t.id !== task.id);
  }
}

